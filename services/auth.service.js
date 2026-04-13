const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
}

async function signup({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user);

  return { user, token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user, token };
}

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

module.exports = { signup, login, getProfile };
