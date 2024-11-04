const mongoose = require('mongoose');
const User = require('../models/user');
const userRoute = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// GET users route
userRoute.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// POST /signup route
userRoute.post('/signup', async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: result });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error from signup', error });
  }
});

// POST /login route
userRoute.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(`this was gotten from login ${user}`)
    if (!user) {
      return res.status(401).json({ message: 'Auth failed: User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        "secretKey",  // Use environment variable for the secret key
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'Auth successful', token, email: user.email });
    } else {
      res.status(401).json({ message: 'Auth failed: Incorrect password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// PATCH user details
userRoute.patch('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  const updateOps = {};

  for (const ops of Object.keys(req.body)) {
    updateOps[ops] = req.body[ops];
  }

  try {
    const updatedUser = await User.updateOne({ _id: userId }, { $set: updateOps });
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// DELETE user route
userRoute.delete('/:userId', async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.userId });
    res.status(200).json({ message: 'User deleted', result });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = userRoute;
