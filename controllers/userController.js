const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: avatar || `https://api.lorem.space/image/face?w=150&h=150&hash=${Math.random().toString(36).substr(2, 9)}`
    });

    // Remove password from output
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};