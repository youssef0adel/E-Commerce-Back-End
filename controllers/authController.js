const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '1d' }
  );

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // 3) Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // 4) Save refresh token
    await saveRefreshToken(user._id, refreshToken);

    // 5) Send response
    res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    );

    // Check if refresh token exists in database
    const storedToken = await RefreshToken.findOne({ 
      token: refresh_token,
      user: decoded.sub
    });

    if (!storedToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(decoded.sub);

    // Delete old refresh token and save new one
    await RefreshToken.deleteOne({ token: refresh_token });
    await saveRefreshToken(decoded.sub, refreshToken);

    res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};