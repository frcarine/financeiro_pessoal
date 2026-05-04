const { Router } = require('express');
const { monthlyReport, exportCsv } = require('../controllers/reportController');
const validate = require('../middleware/validate');
const { reportRules } = require('../utils/validators');

const router = Router();

router.get('/monthly', reportRules, validate, monthlyReport);
router.get('/export-csv', reportRules, validate, exportCsv);

module.exports = router;
