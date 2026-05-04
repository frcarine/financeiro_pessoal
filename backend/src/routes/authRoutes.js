const { Router } = require('express');
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../utils/validators');

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', auth, me);

module.exports = router;
