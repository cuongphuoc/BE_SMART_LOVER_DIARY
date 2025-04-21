const express = require('express');
const router = express.Router();
const multer = require('../util/multer');
const sharingMoment = require('../app/controllers/ShareMomentController');
const Authentication = require('../Middleware/Authentication');
// [POST] /api/sharing-moment - Add moment
router.post(
    '/create-moment',
    multer.single('media'),
    Authentication,
    sharingMoment.createMoment,
);
// [GET] /api/sharing-moment/get-moment
router.get('/get-moment/:id', Authentication, sharingMoment.getMoment);
router.delete('/delete-moment/:id', Authentication, sharingMoment.deleteMoment);

module.exports = router;
