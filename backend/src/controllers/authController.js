import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ error: "User already exists" });

    // We hash cuz if someone hack the db they see jibberish
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash: hash });
    res.status(201).json({ message: "User created", userData: {id: user.id, email: user.email, role: user.role} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid Password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Will be stored in client's localStorage or as an HTTP-only cookie
    // Will be sent in future requests to server via attatched Authorization header
    // Backend chekcs the token to verify the user is logged in
    res.json({ token , userData: {id: user.id, email: user.email, role: user.role}});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
