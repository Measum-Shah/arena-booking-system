import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // check if user exists
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};