const { Router } = require('express');
const { summary, monthly, byCategory } = require('../controllers/dashboardController');

const router = Router();

router.get('/summary', summary);
router.get('/monthly', monthly);
router.get('/by-category', byCategory);

module.exports = router;
