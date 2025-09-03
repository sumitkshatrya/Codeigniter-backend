import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, first_name, last_name, password: hashed, is_active: true 
    });

    res.status(201).json({ id: user._id });
  } catch (e) { 
    res.status(500).json({ message: e.message }); 
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok || !user.is_active) return res.status(401).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ 
      sub: { 
        id: user._id, 
        email: user.email 
      } 
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Single API → create both user + teacher
router.post("/register-teacher", async (req, res) => {
  try {
    const { email, first_name, last_name, password, university_name, gender, year_joined, department } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      first_name, 
      last_name, 
      password: hashed,
      is_active: true 
    });
    
    await Teacher.create({ 
      user_id: user._id, 
      university_name, 
      gender, 
      year_joined, 
      department 
    });
    
    res.status(201).json({ user_id: user._id });
  } catch (e) { 
    res.status(400).json({ message: e.message }); 
  }
});

export default router;