// routes/superadminRoutes.js
const express = require("express");
const { protect, superadminOnly } = require("../middleware/authMiddleware");
const { getAllAdmins, updateAdminStatus, approveAdmin } = require("../controllers/superadminController");
const User = require("../models/User");

const router = express.Router();

// ✅ Get all users (only superadmin)
router.get("/users", protect, superadminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("username email status createdAt lastLogin")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Superadmin can manage admins
router.get("/admins", protect, superadminOnly, getAllAdmins);
router.put("/admins/:id/status", protect, superadminOnly, updateAdminStatus);
router.put("/admins/:id/approve", protect, superadminOnly, approveAdmin);

module.exports = router;
