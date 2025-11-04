const mongoose = require("mongoose");
const User = require("./models/User"); // adjust path if needed
require("dotenv").config(); // loads .env file

// connect to MongoDB Atlas using your .env MONGO_URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

async function migrate() {
  try {
    // update users missing createdAt
    const result = await User.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: new Date() } }
    );

    console.log(`✅ Migration complete. ${result.modifiedCount} users updated.`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration error:", err);
    mongoose.disconnect();
  }
}

migrate();
