const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// UPDATED SYNC FUNCTION
const syncUser = async (req, res) => {
  const { clerkId, email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Agar user nahi hai to create karo
      user = await User.create({ 
        name, 
        email, 
        password: 'clerk_' + clerkId, // Unique password
        clerkId
      });
    }

    // Token generate karo
    const token = generateToken(user._id);

    // Response bhejo
    res.status(200).json({ 
      success: true,
      token: token, // Token directly send karo
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Server Error during sync' });
  }
};

module.exports = { registerUser, loginUser, syncUser };
