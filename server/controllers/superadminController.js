const User = require("../models/User");

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("username email status createdAt approvedBySuperadmin")
      .sort({ createdAt: -1 });
    console.log("Fetched admins:", admins.map(a => ({ id: a._id, createdAt: a.createdAt })));

    console.log("Fetched admins:", admins);
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// Update admin status (activate/deactivate/reject)
const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBySuperadmin  } = req.body; // should be "active" or "inactive"

    const admin = await User.findById(id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    //admin.status = status;
    if (status) admin.status = status;
    if (approvedBySuperadmin !== undefined) {
      admin.approvedBySuperadmin = approvedBySuperadmin;
    }
    await admin.save();

    res.json({ message: `Admin status updated to ${status}`, admin });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin status" });
  }
};

// Approve admin (special endpoint)
const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.approvedBySuperadmin = true;
    admin.status = "active"; // give access
    await admin.save();

    res.json({ message: "Admin approved successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllAdmins, updateAdminStatus, approveAdmin };
