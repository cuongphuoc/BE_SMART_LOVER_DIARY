// controllers/ChatController.js
const User = require('../models/User'); // Mô hình User
const Couple = require('../models/Couple'); // Mô hình Couple
const Diary = require('../models/Diary'); // Mô hình Diary
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ChatController {
  constructor() {
    const apiKey = "AIzaSyAH-BAvWNzom-8OAOPEr9lXDtpdYG1YtPE"; // Thay bằng khóa API thật của bạn
    if (!apiKey) {
      throw new Error('API key is missing.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  sendMessage = async (req, res) => {
    try {
      const { prompt } = req.body;
      const userId = req.user.id; // Lấy userId từ thông tin user đã xác thực trong middleware

      if (!prompt) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tin nhắn.' });
      }

      // 1. Lấy id_couple của người dùng
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
      }
      const coupleId = user.id_couple ? user.id_couple.toString() : null;
      if (!coupleId) {
        return res.status(404).json({ error: 'Người dùng chưa thuộc về cặp đôi nào.' });
      }

      // 2. Lấy thông tin của cặp đôi và hai người dùng
      const couple = await Couple.findById(coupleId);
      if (!couple) {
        return res.status(404).json({ error: 'Không tìm thấy cặp đôi.' });
      }

      const user1 = await User.findById(couple.id_user1);
      const user2 = await User.findById(couple.id_user2);

      if (!user1 || !user2) {
        return res.status(404).json({ error: 'Không tìm thấy thông tin của một trong hai người dùng trong cặp đôi.' });
      }

      const createdAt = couple.createdAt;
      const today = new Date();
      const diffTime = Math.abs(today - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 3. Lấy nhật ký của cặp đôi
      const diaries = await Diary.find({ id_couple: coupleId });

      // 4. Tạo prompt hệ thống chi tiết
      const systemPrompt = [
        {
          role: "user",
          parts: [
            { text: `Bạn là Insghta, một chuyên gia tư vấn tình cảm tận tâm, thấu hiểu và luôn đưa ra những lời khuyên thiết thực, ngắn gọn dựa trên tình hình hiện tại của cặp đôi.` },
            { text: `Tính cách của bạn: Tích cực, khích lệ, tránh tiêu cực hoặc gây lo lắng.` },
            { text: `Thông tin về cặp đôi:` },
            { text: `- Tên người dùng 1: ${user1.name}` },
            { text: `- Tên người dùng 2: ${user2.name}` },
            { text: `- Số ngày quen nhau: ${diffDays} (chỉ tham khảo để hiểu bối cảnh, không nhắc lại trực tiếp trừ khi được hỏi).` },
            { text: `Hướng dẫn về trả lời:` },
            { text: `- Luôn trả lời ngắn gọn, đi thẳng vào vấn đề và dễ hiểu (tối đa 2-3 câu).` },
            { text: `- Hạn chế tối đa việc đặt câu hỏi. Chỉ đặt câu hỏi khi thực sự cần thiết để hiểu rõ hơn vấn đề hiện tại và luôn giữ câu hỏi ngắn gọn (1 câu).` },
            { text: `- Tập trung vào tin nhắn hiện tại của người dùng. Tránh lan man hoặc đưa ra lời khuyên không liên quan.` },
            { text: `- Không nhắc lại số ngày yêu nhau trừ khi người dùng trực tiếp đề cập đến nó.` },
            { text: `Hướng dẫn về sử dụng nhật ký:` },
            { text: `- Bạn đã được cung cấp một số nhật ký trước đây của cặp đôi. Hãy sử dụng thông tin này để hiểu rõ hơn về những khoảnh khắc, cảm xúc và vấn đề mà họ có thể đã trải qua.` },
            { text: `- Đưa ra lời khuyên có liên quan đến những gì đã được ghi lại trong nhật ký nếu phù hợp, nhưng không chỉ đơn thuần tóm tắt lại nhật ký. Hãy kết nối nó với vấn đề hiện tại nếu có.` },
            { text: `- Nhạy cảm với những thông tin cá nhân trong nhật ký và tránh tiết lộ những chi tiết quá riêng tư trừ khi người dùng chủ động đề cập đến chúng trong tin nhắn hiện tại.` },
            { text: `-Người tạo ra bạn là DongPhuocCuong` },
            { text: `-Team tạo ra bạn có 5 người ` },
            { text: `-Tên app này là Smart Diary Lover` },
            






          ],
        },
        {
          role: "model",
          parts: [
            { text: `Chào bạn! Mình là Insghta và sẵn sàng lắng nghe bạn đây.` },
          ],
        },
      ];

      // 5. Tạo lịch sử trò chuyện bao gồm prompt hệ thống và nhật ký
      const chatHistory = [...systemPrompt];

      diaries.forEach(diary => {
        const diaryOwner = diary.id_user === user1.id ? user1.name : user2.name;
        chatHistory.push({
          role: "user",
          parts: [
            { text: `Nhật ký của ${diaryOwner}: Tiêu đề: ${diary.title}, Nội dung: ${diary.description}` },
          ],
        });
      });

      // Thêm tin nhắn hiện tại của người dùng vào lịch sử
      chatHistory.push({
        role: "user",
        parts: [
          { text: prompt },
        ],
      });

      // 6. Tạo chat và gửi tin nhắn
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Sử dụng gemini-pro cho khả năng tốt hơn
      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(prompt);
      const text = await result.response.text();

      res.status(200).json({ response: text });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn đến Gemini:', error.message);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý tin nhắn.' });
    }
  };
}

module.exports = new ChatController();