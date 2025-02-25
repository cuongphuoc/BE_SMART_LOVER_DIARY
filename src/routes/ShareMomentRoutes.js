const express = require('express');
const router = express.Router();
const multer = require('../util/multer');
const sharingMoment = require('../app/controllers/ShareMomentController');

// [POST] /api/sharing-moment - Add moment
router.post(
    '/create-moment',
    multer.single('media'),
    sharingMoment.createMoment,
);

module.exports = router;
