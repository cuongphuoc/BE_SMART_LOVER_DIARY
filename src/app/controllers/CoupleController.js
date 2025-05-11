const Couple = require('../models/Couple');
const User = require('../models/User');
class coupleController {
    // [POST] /api/couples/match
    async matchCouple(req, res) {
        try {
            const { codeInput } = req.body;
            const userId2 = req.user._id;

            if (!codeInput) {
                return res
                    .status(400)
                    .json({ error: 'Mã ghép đôi không được để trống.' });
            }

            const user1 = await User.findOne({ couplecode: codeInput });
            if (!user1) {
                return res
                    .status(404)
                    .json({ error: 'Không tìm thấy người dùng với mã này.' });
            }

            const user2 = await User.findById(userId2);
            if (!user2) {
                return res
                    .status(404)
                    .json({ error: 'Người dùng không tồn tại.' });
            }

            if (String(user1._id) === String(user2._id)) {
                return res
                    .status(400)
                    .json({ error: 'Không thể tự ghép chính mình!' });
            }

            if (user1.isMatched || user2.isMatched) {
                return res
                    .status(400)
                    .json({ error: 'Một trong hai người đã ghép đôi rồi.' });
            }

            // Kiểm tra cặp đôi đã tồn tại chưa
            const existingCouple = await Couple.findOne({
                couplecode: user1.couplecode,
            });
            if (existingCouple) {
                return res
                    .status(400)
                    .json({ error: 'Cặp đôi đã tồn tại trong hệ thống.' });
            }

            // Tạo cặp đôi mới
            const couple = new Couple({
                couplecode: user1.couplecode,
                userId1: user1._id,
                userId2: user2._id,
                coupleName: `${user1.name} & ${user2.name}`,
                startDate: new Date(),
                slug: `${user1.name.toLowerCase()}-${user2.name.toLowerCase()}`,
            });

            await couple.save();

            user1.id_couple = couple._id;
            user1.isMatched = true;

            user2.id_couple = couple._id;
            user2.isMatched = true;

            await user1.save();
            await user2.save();

            res.status(201).json({ message: 'Ghép đôi thành công!', couple });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async unMatchCouple(req, res) {
        try {
            const userId = req.user._id;
            const user = await User.findById(userId);

            if (!user)
                return res
                    .status(404)
                    .json({ error: 'Người dùng không tồn tại.' });
            if (!user.isMatched || !user.id_couple) {
                return res
                    .status(400)
                    .json({
                        error: 'Người dùng chưa ghép đôi hoặc thiếu id_couple.',
                    });
            }

            const couple = await Couple.findById(user.id_couple);
            if (!couple)
                return res
                    .status(404)
                    .json({ error: 'Cặp đôi không tồn tại.' });

            await Couple.deleteOne({ _id: couple._id });

            user.id_couple = null;
            user.isMatched = false;

            const otherUserId = user._id.equals(couple.userId1)
                ? couple.userId2
                : couple.userId1;
            const otherUser = await User.findById(otherUserId);

            if (otherUser) {
                otherUser.id_couple = null;
                otherUser.isMatched = false;
                await otherUser.save();
            }

            await user.save();

            res.status(200).json({ message: 'Hủy ghép đôi thành công!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /api/couples/update
    async updateCouple(req, res) {
        try {
            const { coupleName } = req.body;
            const couplecode = req.user.couplecode;
            const couple = await Couple.findOne({ couplecode });

            if (!couple) {
                return res
                    .status(404)
                    .json({ error: 'Cặp đôi không tồn tại.' });
            }

            couple.coupleName = coupleName;
            await couple.save();

            return res
                .status(200)
                .json({ message: 'Cập nhật thành công!', couple });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new coupleController();
