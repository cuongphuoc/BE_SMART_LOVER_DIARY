const Couple = require('../models/Couple');
const User = require('../models/Account');

class coupleController {
    // [POST] /api/couples/match
    async matchCouple(req, res) {
        try {
            const { codeInput } = req.body;
            const userId2 = req.user._id;

            const user1 = await User.findOne({ code: codeInput }); // tìm theo code
            if (!user1) {
                return res
                    .status(404)
                    .json({ error: 'Không tìm thấy người dùng với mã này.' });
            }

            // tìm user2
            const user2 = await User.findById(userId2);
            if (!user2) {
                return res
                    .status(404)
                    .json({ error: 'Người dùng 2 không tồn tại.' });
            }

            // không tự cho phép ghép đôi chính mình
            if (String(user1._id) === String(user2._id)) {
                return res
                    .status(400)
                    .json({ error: 'Không thể tự ghép chính mình!' });
            }

            // nếu isMatched là true thì không cho ghép đôi nữa
            if (user1.isMatched || user2.isMatched) {
                return res
                    .status(400)
                    .json({ error: 'Một trong hai người đã ghép đôi rồi.' });
            }

            // ghi đè thông tin couple vào user1 và user2
            user2.codeCouple = user1.code;
            user1.codeCouple = user1.code;
            user2.isMatched = true;
            user1.isMatched = true;

            // lưu
            await user2.save();
            await user1.save();

            // check nếu couple đã tồn tại trong cơ sở dữ liệu
            const existingCouple = await Couple.findOne({
                codeCouple: user1.code,
            });
            if (existingCouple) {
                return res
                    .status(400)
                    .json({ error: 'Cặp đôi đã tồn tại trong hệ thống.' });
            }

            // tạo Couple mới
            const couple = new Couple({
                codeCouple: user1.code,
                userId1: user1._id,
                userId2: user2._id,
                coupleName: `${user1.name} & ${user2.name}`,
                startDate: new Date(),
                slug: `${user1.name.toLowerCase()}-${user2.name.toLowerCase()}`, // tạo slug
            });

            await couple.save();

            res.status(201).json({ message: 'Ghép đôi thành công!', couple });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async unMatchCouple(req, res) {
        try {
            const userId = req.user._id; // ID của người dùng hiện tại
            const user = await User.findById(userId); // tìm user hiện tại
            if (!user)
                return res
                    .status(404)
                    .json({ error: 'Người dùng không tồn tại.' });
            const couple = await Couple.findOne({
                codeCouple: user.codeCouple,
            }); // tìm couple theo codeCouple
            if (!couple)
                return res
                    .status(404)
                    .json({ error: 'Cặp đôi không tồn tại.' });
            if (!user.isMatched)
                return res
                    .status(400)
                    .json({ error: 'Người dùng chưa ghép đôi.' });
            // xóa couple
            await Couple.deleteOne({ _id: couple._id });
            user.codeCouple = 0;
            user.isMatched = false;
            const otherUserId =
                user._id === couple.userId1.toString()
                    ? couple.userId2
                    : couple.userId1;

            const otherUser = await User.findById(otherUserId);
            if (otherUser) {
                otherUser.codeCouple = 0;
                otherUser.isMatched = false;
                await otherUser.save();
            }
            await user.save();

            res.status(200).json({ message: 'Hủy ghép đôi thành công!' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async updateCouple(req, res) {
        try {
            const { coupleName } = req.body;
            const codeCouple = req.user.codeCouple; // lấy codeCouple từ localStorage
            const couple = await Couple.findOne({
                codeCouple,
            }); // tìm couple theo codeCouple
            if (!couple)
                return res.status(404).json({
                    error: 'Cặp đôi không tồn tại.',
                });
            couple.coupleName = coupleName; // cập nhật tên cặp đôi
            await couple.save(); // lưu lại thay đổi
            return res.status(200).json({
                message: 'Cập nhật thành công!',
                couple,
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
}

module.exports = new coupleController();
