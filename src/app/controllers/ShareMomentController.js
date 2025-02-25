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
            console.error('Error creating moment:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ShareMomentController();
