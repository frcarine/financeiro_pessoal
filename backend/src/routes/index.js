const { Router } = require('express');
const auth = require('../middleware/auth');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');
const budgetRoutes = require('./budgetRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/categories', auth, categoryRoutes);
router.use('/transactions', auth, transactionRoutes);
router.use('/budgets', auth, budgetRoutes);
router.use('/dashboard', auth, dashboardRoutes);
router.use('/reports', auth, reportRoutes);

module.exports = router;
