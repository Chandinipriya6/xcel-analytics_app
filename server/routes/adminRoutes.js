const express = require("express");
const User = require("../models/User");
const Upload = require("../models/Upload");
const { protect, adminOnly, superadminOnly , adminOrSuperadmin} = require("../middleware/authMiddleware");
const { getAllAdmins,updateAdminStatus,approveAdmin } = require("../controllers/superadminController");

const router = express.Router();

// Get all users
// router.get("/users", protect, adminOnly, async (req, res) => {
//   try {
//     const users = await User
//     .find({}, "username email status createdAt lastLogin")
//     .sort({createdAt:-1})
//     .lean();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Toggle user status
// router.patch("/users/:id/toggle", protect, adminOnly, async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).json({ message: "User not found" });
//   user.status = user.status === "active" ? "inactive" : "active";
//   await user.save();
//   res.json({ message: "Status updated", status: user.status });
// });

// List users
router.get("/users", protect, adminOrSuperadmin, async (req, res) => {
  try {
    const users = await User
      .find({ role: "user" }, "username email status createdAt lastLogin")
      .sort({ createdAt: -1 })
      .lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user active/inactive
router.patch("/users/:id/toggle", protect, adminOrSuperadmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "user") return res.status(404).json({ message: "User not found" });
  user.status = user.status === "active" ? "inactive" : "active";
  await user.save();
  res.json({ message: "Status updated", status: user.status });
});

// Admin summary route
router.get("/summary", protect, adminOnly, async (req, res) => {
  try {
    const totalUploads = await Upload.countDocuments();

    const storageAgg = await Upload.aggregate([
      { $group: { _id: null, totalStorage: { $sum: "$size" } } }
    ]);
    const totalStorage = storageAgg[0]?.totalStorage || 0;

    const uploadsByUser = await Upload.aggregate([
      { $group: { _id: "$uploadedBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let topUploader = null;
    if (uploadsByUser.length > 0) {
      const user = await User.findById(uploadsByUser[0]._id).select("fullName email");
      topUploader = { ...uploadsByUser[0], user };
    }

    res.json({
      totalUploads,
      totalStorage,
      uploadsByUser: topUploader ? [topUploader] : []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get admin profile
router.get("/profile", protect, adminOnly, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select(
      "username email role createdAt lastLogin"
    );

     console.log("Profile fetched:", admin);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/storage", protect, async (req, res) => {
  try {
    let totalStorage = 0;
    let roleStorage = null;

    if (req.user.role === "superadmin") {
      // Total storage across all uploads
      const agg = await Upload.aggregate([
        { $group: { _id: null, totalStorage: { $sum: "$size" } } },
      ]);
      totalStorage = agg[0]?.totalStorage || 0;

      // Optional: breakdown per user
      const breakdown = await Upload.aggregate([
        { $group: { _id: "$uploadedBy", storage: { $sum: "$size" } } },
      ]);
      roleStorage = breakdown;

    } else if (req.user.role === "admin") {
      // Only admin's uploads
      const agg = await Upload.aggregate([
        { $match: { uploadedBy: req.user._id } },
        { $group: { _id: null, totalStorage: { $sum: "$size" } } },
      ]);
      totalStorage = agg[0]?.totalStorage || 0;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ totalStorage, roleStorage });
  } catch (err) {
    console.error("Error fetching storage:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Superadmin can view all admins
router.get("/admins", protect, superadminOnly, getAllAdmins);
router.put("/admins/:id/status", protect, superadminOnly, updateAdminStatus);
router.put("/admins/:id/approve", protect, superadminOnly, approveAdmin);

module.exports = router;
