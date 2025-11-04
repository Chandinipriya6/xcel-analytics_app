// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   fullName: String,
//   email: String,
//   username: String,
//   password: String,
//   role: String, // 'user' or 'admin'
//   adminId: String,
//   verified: {
//     type: Boolean,
//     default: false,
//   },
//   verificationPassword: String,
//   status: { type: String, enum: ["active", "inactive"], default: "inactive" },
//   lastLogin:{type:Date}
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  username: String,
  password: String,
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  adminId: String, // for admin
  superAdminId: String, // for superadmin
  approvedBySuperadmin: { type: Boolean, default: false }, // for admin approval
  verified: { type: Boolean, default: false },
  verificationPassword: String,
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
