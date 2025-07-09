const express = require('express');
const router = express.Router();
const GeneralController = require('../controllers/generalController');
const generalController = new GeneralController();

router.get('/summary', generalController.getSummary.bind(generalController));

module.exports = router;