import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";

const router = express.Router();

router.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await User.find({}, "email first_name last_name is_active createdAt");
    res.json({ data: users });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/teachers", requireAuth, async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("user_id", "email first_name last_name");
    const data = teachers.map(t => ({
      id: t._id,
      user_id: t.user_id._id,
      email: t.user_id.email,
      first_name: t.user_id.first_name,
      last_name: t.user_id.last_name,
      university_name: t.university_name,
      gender: t.gender,
      year_joined: t.year_joined,
      department: t.department
    }));
    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;