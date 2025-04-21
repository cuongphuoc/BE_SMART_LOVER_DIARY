const Moment = require('../models/ShareMomentsModel');
const fs = require('fs');
const path = require('path');

class ShareMomentController {
    // [POST] /api/moments - Tạo moment mới
    async createMoment(req, res, next) {
        try {
            const { coupleId, content } = req.body;
            const userId = req.user._id;
            let mediaUrl = null;
            console.log('req.user:', req.user);

            if (req.file) {
                mediaUrl = `uploads/${req.file.filename}`;
            }

            const moment = new Moment({
                coupleId,
                userId,
                content,
                mediaUrl,
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

    // [GET] /api/moments/:id - Lấy tất cả moments theo coupleId
    async getMoment(req, res) {
        try {
            const { id } = req.params;
            const result = await Moment.find({ coupleId: id }).sort({
                createdAt: -1,
            });

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

    // [DELETE] /api/moments/:id - Xoá moment theo id
    async deleteMoment(req, res) {
        try {
            const { id } = req.params;
            const moment = await Moment.findById(id);

            if (!moment) {
                return res.status(404).json({ message: 'Moment not found' });
            }

            // Chỉ người tạo hoặc admin mới có quyền xoá
            if (
                req.user.role !== 'admin' &&
                moment.userId.toString() !== req.user._id.toString()
            ) {
                return res
                    .status(403)
                    .json({ message: 'Bạn không có quyền xoá moment này' });
            }

            // Nếu có file đính kèm → xoá file trong thư mục uploads
            if (moment.mediaUrl) {
                const filePath = path.join(
                    __dirname,
                    '..',
                    '..',
                    moment.mediaUrl,
                );
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Không thể xoá file:', err);
                });
            }

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
