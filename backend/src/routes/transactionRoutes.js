const { Router } = require('express');
const { listTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const validate = require('../middleware/validate');
const { transactionRules } = require('../utils/validators');

const router = Router();

router.get('/', listTransactions);
router.get('/:id', getTransaction);
router.post('/', transactionRules, validate, createTransaction);
router.put('/:id', transactionRules, validate, updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
