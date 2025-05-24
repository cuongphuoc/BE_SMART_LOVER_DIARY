const express = require('express');
const router = express.Router();
const authLogin = require('../app/middleware/AuthenLogin');
const getDiaryStats = require('../app/controllers/HomeCotroller');

router.get('/', authLogin, getDiaryStats);

module.exports = router;
