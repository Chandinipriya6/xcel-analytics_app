
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const { getPendingAdmins, approveAdmin } = require("./controllers/authController");
const { protect, superadminOnly } = require("./middleware/authMiddleware"); // You need to create this middleware
const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require('./routes/analysisRoutes');
const adminRoutes = require("./routes/adminRoutes"); // <-- NEW
const summaryRoutes = require('./routes/summaries');
const insightsRoutes = require("./routes/insights");
const geminiService = require("./routes/geminiService");
const superadminRoutes = require("./routes/superadminRoutes");

const seedSuperadmin = async () => {
  try {
    const email = "chandinipriya530@gmail.com";   // your fixed superadmin email
    const password = "yourStrongPassword123";     // choose a strong password
    const superAdminId = "1";                     // fixed ID

    let superadmin = await User.findOne({ email, role: "superadmin" });

    if (!superadmin) {
      const hashedPassword = await bcrypt.hash(password, 10);

      superadmin = new User({
        fullName: "Platform Superadmin",
        email,
        username: "superadmin",
        password: hashedPassword,
        role: "superadmin",
        superAdminId,
        approvedBySuperadmin: true,
        verified: true,
        status: "active",
      });

      await superadmin.save();
      console.log("✅ Superadmin seeded into DB");
    } else {
      console.log("ℹ️ Superadmin already exists");
    }
  } catch (err) {
    console.error("Superadmin seed error:", err);
  }
};

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.use("/api/auth", authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/summaries', summaryRoutes);
app.use("/api", insightsRoutes);
app.use("/api/superadmin", superadminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async() => {
    await seedSuperadmin();
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
