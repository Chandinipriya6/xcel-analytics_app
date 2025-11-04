const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ------------------- REGISTER -------------------
exports.register = async (req, res) => {
  try {
    const { fullName, email, username, password, role, adminId } = req.body;

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      fullName,
      email: emailLower,
      username,
      password: hashedPassword,
      role,
      adminId: role === "admin" ? adminId : "",
      verificationPassword: otp,
      approvedBySuperadmin: role === "admin" ? false : true, // Admins require superadmin approval
      verified: false,
    });

    await newUser.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailLower,
        subject: "Verify your Email - Excel Analytics Platform",
        text: `Your verification code is: ${otp}`,
      });
      console.log("Email sent to:", emailLower);
    } catch (err) {
      console.error("Email send error:", err);
    }

    res.status(200).json({
      message: "Registration successful. Please check your email for verification code."
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ------------------- VERIFY -------------------
exports.verify = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user || String(user.verificationPassword) !== String(code)) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.verified = true;
    user.verificationPassword = "";
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

// ------------------- LOGIN -------------------
exports.login = async (req, res) => {
  const { email, password, adminId, role } = req.body;

  try {
    let user;

    if (role === "admin") {
      if (!adminId) return res.status(400).json({ error: "Admin ID is required" });

      user = await User.findOne({ email, adminId, role: "admin" });
      if (user && !user.approvedBySuperadmin) {
        return res.status(403).json({ error: "Waiting for superadmin approval" });
      }
    } else {
      user = await User.findOne({ email, role });
    }

    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.verified) return res.status(400).json({ error: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        token,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ------------------- SUPERADMIN REGISTER -------------------
exports.superadminRegister = async (req, res) => {
  // try {
  //   const { fullName, email, password, superAdminId } = req.body;

  //   const existingUser = await User.findOne({ email: email.toLowerCase() });
  //   if (existingUser) return res.status(400).json({ error: "Email already registered" });

  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const otp = generateOTP();

  //   const newSuperadmin = new User({
  //     fullName,
  //     email: email.toLowerCase(),
  //     password: hashedPassword,
  //     role: "superadmin",
  //     superAdminId,
  //     verificationPassword: otp,
  //     verified: false, // <-- must verify with OTP
  //   });

  //   await newSuperadmin.save();

  //   try {
  //     await transporter.sendMail({
  //       from: process.env.EMAIL_USER,
  //       to: email.toLowerCase(),
  //       subject: "Verify your Email - Excel Analytics Platform (Superadmin)",
  //       text: `Your verification code is: ${otp}`,
  //     });
  //     console.log("Superadmin OTP email sent to:", email);
  //   } catch (err) {
  //     console.error("Superadmin Email send error:", err);
  //   }

  //   res.status(200).json({
  //     success: true,
  //     message: "Superadmin registration successful. Please check your email for verification code."
  //   });

  // } catch (err) {
  //   console.error("Superadmin registration error:", err);
  //   res.status(500).json({ error: "Superadmin registration failed" });
  // }
};

// ------------------- SUPERADMIN LOGIN -------------------
exports.superadminLogin = async (req, res) => {
  try {
    const { email, password, superAdminId } = req.body;

    const superadmin = await User.findOne({ email, superAdminId, role: "superadmin" });
    if (!superadmin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, superadmin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    superadmin.lastLogin = new Date();
    await superadmin.save();

    const token = jwt.sign({ id: superadmin._id, role: superadmin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      user: {
        username: superadmin.username,
        role: superadmin.role,
        token,
        lastLogin: superadmin.lastLogin,
        createdAt: superadmin.createdAt
      },
    });

  } catch (err) {
    console.error("Superadmin login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ------------------- SUPERADMIN ADMIN APPROVAL -------------------
// Get pending admins
exports.getPendingAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin", approvedBySuperadmin: false });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending admins" });
  }
};

// Approve admin
exports.approveAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    const admin = await User.findOne({ adminId, role: "admin" });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    admin.approvedBySuperadmin = true;
    await admin.save();

    res.json({ success: true, message: "Admin approved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve admin" });
  }
};
