const User = require('../models/User');  // Mô hình User
const Couple = require('../models/Couple');  // Mô hình Couple
const Diary = require('../models/Diary');  // Mô hình Diary
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ChatController {
  constructor() {
    const apiKey = "AIzaSyAH-BAvWNzom-8OAOPEr9lXDtpdYG1YtPE";  // Thay bằng khóa API thật của bạn
    if (!apiKey) {
      throw new Error('API key is missing.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  sendMessage = async (req, res) => {
    try {
      const { prompt } = req.body;
      const userId = req.user.id;  // Lấy userId từ thông tin user đã xác thực trong middleware

      if (!prompt) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tin nhắn.' });
      }

      // 1. Lấy id_couple của người dùng
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
      }
    console.log(user.id_couple.toString());
      const coupleId = user.id_couple.toString();
      if (!coupleId) {
        return res.status(404).json({ error: 'Không tìm thấy cặp đôi của người dùng.' });
      }

      // 2. Lấy tên của cả hai người trong cặp đôi
      const couple = await Couple.findById(coupleId);
      if (!couple) {
        return res.status(404).json({ error: 'Không tìm thấy cặp đôi.' });
      }

      const user1 = await User.findById(couple.id_user1);
      const user2 = await User.findById(couple.id_user2);
console.log(couple)
      if (!user1 || !user2) {
        return res.status(404).json({ error: 'Không tìm thấy thông tin của một trong hai người dùng trong cặp đôi.' });
      }
      const createdAt = couple.createdAt;
const today = new Date();
const diffTime = Math.abs(today - createdAt);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 3. Lấy nhật ký của cặp đôi
      const diaries = await Diary.find({ id_couple: coupleId });

      // 4. Ghép tên với nhật ký và tạo lịch sử trò chuyện
      const chatHistory = [
        {
          role: "user",
          parts: [
            { text: `Bạn là Insghta, một chuyên gia tư vấn tình cảm` },
            { text: `Hãy nhớ rằng người dùng đang yêu cầu tư vấn tình cảm, tên là ${user1.name} và ${user2.name}, họ quen nhau được ${diffDays} ngày ,và họ đang ở trong mối quan hệ với nhau tư vấn cho họ ngắn gọn đừng hỏi họ nhiều nhé đừng nhắc lại số ngày yêu nhau của họ.` },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Chào bạn! Mình là Insghta nè !" },
          ],
        },
      ];

      // Thêm nhật ký vào lịch sử trò chuyện
      diaries.forEach(diary => {
        const diaryOwner = diary.id_user === user1.id ? user1.name : user2.name;
        console.log(diary.title)
        chatHistory.push({
          role: "user",
          parts: [
            { text: `Nhật ký của ${diaryOwner}: ${diary.title} - ${diary.description}` },
          ],
        });
      });

      // 5. Tạo chat và gửi tin nhắn
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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
