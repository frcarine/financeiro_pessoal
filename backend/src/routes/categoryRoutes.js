const { Router } = require('express');
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const validate = require('../middleware/validate');
const { categoryRules } = require('../utils/validators');

const router = Router();

router.get('/', listCategories);
router.post('/', categoryRules, validate, createCategory);
router.put('/:id', categoryRules, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
