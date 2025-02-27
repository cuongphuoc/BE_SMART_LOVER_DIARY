const Moment = require('../models/ShareMomentsModel');
class ShareMomentController {
    async createMoment(req, res, next) {
        try {
            const { coupleId, userId, content } = req.body;
            let mediaUrl = null;

            // Nếu có file được upload (Multer sẽ gán vào req.file)
            if (req.file) {
                mediaUrl = `uploads/${req.file.filename}`;
            }
            // mid auth
            // Lấy userId từ token (middleware auth đã gán vào req.user)
            //   const userId = req.user && req.user.id ? req.user.id : null;
            //   if (!userId) {
            //     return res.status(401).json({ message: 'User is not authenticated' });
            //   }

            // Tạo một moment mới
            const moment = new Moment({
                coupleId,
                userId,
                content,
                mediaUrl,
                createdAt: Date.now(),
            });

            await moment.save();
            return res.status(201).json({
                message: 'Moment created successfully',
                moment,
            });
        } catch (error) {
            console.error('Error CREATE moment:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getMoment(req, res) {
        try {
            const { id } = req.params;
            const result = await Moment.find({ coupleId: id });
            if (!result || result.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No Moment found for this couple' });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error('Error GET moment:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteMoment(req, res) {
        try {
            const { id } = req.params; // lấy id từ request

            // check xem Moment có tồn tại không
            const moment = await Moment.findById(id);
            if (!moment) {
                return res.status(404).json({ message: 'Moment not found' });
            }

            // xoas Moment
            await Moment.findByIdAndDelete(id);

            return res
                .status(200)
                .json({ message: 'Moment deleted successfully' });
        } catch (error) {
            console.error('Error DELETE moment:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ShareMomentController();
