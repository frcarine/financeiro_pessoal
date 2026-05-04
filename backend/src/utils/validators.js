const { body, query } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Nome e obrigatorio'),
  body('email').isEmail().withMessage('E-mail invalido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const loginRules = [
  body('email').isEmail().withMessage('E-mail invalido').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha e obrigatoria')
];

const transactionRules = [
  body('description').trim().notEmpty().withMessage('Descricao e obrigatoria'),
  body('amount').isFloat({ gt: 0 }).withMessage('Valor deve ser maior que zero'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo invalido'),
  body('categoryId').notEmpty().withMessage('Categoria e obrigatoria'),
  body('date').isISO8601().withMessage('Data invalida')
];

const categoryRules = [
  body('name').trim().notEmpty().withMessage('Nome e obrigatorio'),
  body('color').optional().isHexColor().withMessage('Cor invalida'),
  body('icon').optional().trim()
];

const budgetRules = [
  body('month').isInt({ min: 1, max: 12 }).withMessage('Mes invalido'),
  body('year').isInt({ min: 2000 }).withMessage('Ano invalido'),
  body('limit').isFloat({ gt: 0 }).withMessage('Limite deve ser maior que zero'),
  body('categoryId').notEmpty().withMessage('Categoria e obrigatoria')
];

const reportRules = [
  query('month').isInt({ min: 1, max: 12 }).withMessage('Mes invalido'),
  query('year').isInt({ min: 2000 }).withMessage('Ano invalido')
];

module.exports = { registerRules, loginRules, transactionRules, categoryRules, budgetRules, reportRules };
