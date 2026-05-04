const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const defaultCategories = require('../utils/defaultCategories');

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res) {
  const { name, email, password } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: 'E-mail ja cadastrado' });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      categories: { create: defaultCategories }
    },
    select: { id: true, name: true, email: true }
  });

  return res.status(201).json({ user, token: createToken(user.id) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais invalidas' });
  }

  return res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token: createToken(user.id)
  });
}

async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true }
  });
  return res.json(user);
}

module.exports = { register, login, me };
