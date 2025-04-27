const express = require('express');
const router = express.Router();
const Authentication = require('../app/Middleware/Authentication');
const coupleController = require('../app/controllers/CoupleController');

router.post('/match', Authentication, coupleController.matchCouple);
router.post('/unmatch', Authentication, coupleController.unMatchCouple);
router.put('/update', Authentication, coupleController.updateCouple);
module.exports = router;
