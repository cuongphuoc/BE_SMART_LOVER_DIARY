const express = require('express');
const router = express.Router();
const authAdmind=require('../app/middleware/AuthenAdmin')
const admin = require('../app/controllers/AdminCotroller');

// [GET] /api/expenses - Lấy danh sách tất cả chi tiêu
router.get('/alldiary',authAdmind,admin.getAllDiaries);
router.delete('/diary',authAdmind,admin.deleteDiary);
router.get('/couple',authAdmind,admin.getAllCouples);
router.delete('/couple',authAdmind,admin.deleteCouple);



// [POST] /api/expenses - Thêm chi tiêu mới


module.exports = router;
