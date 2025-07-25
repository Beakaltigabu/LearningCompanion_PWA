import db from '../models/index.js';
import jwt from 'jsonwebtoken';

const { User, Child } = db;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user (parent)
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password, // Hashed by model hook
      role: 'parent',
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user.id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Auth user & get token (login for parent/child)
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password, name, pin } = req.body;

  try {
    let user;
    // Parent login attempt
    if (email && password) {
      user = await User.findOne({ where: { email, role: 'parent' } });
      if (user && (await user.checkPassword(password))) {
        return res.json({
          success: true,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
          },
        });
      }
    } 
    // Child login attempt
    else if (name && pin) {
      user = await Child.findOne({ where: { name } });
      if (user && (await user.checkPin(pin))) {
        // Note: We are generating a token with the Child's ID, which is a UUID.
        // The 'protect' middleware should be able to handle this.
        return res.json({
          success: true,
          data: {
            id: user.id,
            name: user.name,
            role: 'child', // Manually setting role for response
            token: generateToken(user.id),
          },
        });
      }
    } 
    // Invalid credentials or input
    else {
        return res.status(400).json({ success: false, message: 'Please provide either email/password or name/pin' });
    }

    // If authentication fails for any reason
    res.status(401).json({ success: false, message: 'Invalid credentials' });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user is populated by the 'protect' middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'pin'] },
    });

    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // Hook will hash it
    }

    // Update JSON fields for notification and AI settings
    if (req.body.notification_preferences) {
        user.notification_preferences = req.body.notification_preferences;
    }
    if (req.body.ai_settings) {
        user.ai_settings = req.body.ai_settings;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        notification_preferences: updatedUser.notification_preferences,
        ai_settings: updatedUser.ai_settings,
        token: generateToken(updatedUser.id),
      },
    });
  } catch (error) {
    next(error);
  }
};
