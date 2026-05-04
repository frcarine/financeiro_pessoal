const { Router } = require('express');
const { listBudgets, createBudget, updateBudget } = require('../controllers/budgetController');
const validate = require('../middleware/validate');
const { budgetRules } = require('../utils/validators');

const router = Router();

router.get('/', listBudgets);
router.post('/', budgetRules, validate, createBudget);
router.put('/:id', budgetRules, validate, updateBudget);

module.exports = router;
