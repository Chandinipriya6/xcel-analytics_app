// const mongoose = require("mongoose");
// const User = require("./models/User"); // adjust path if needed
// require("dotenv").config(); // if using .env for MONGO_URI

// async function addCreatedAtToOldUsers() {
//   try {
//     // 1. Connect to DB
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected...");

//     // 2. Update users without createdAt
//     const result = await User.updateMany(
//       { createdAt: { $exists: false } },
//       { $set: { createdAt: new Date() } }
//     );

//     console.log("Updated users:", result.modifiedCount);
//   } catch (err) {
//     console.error("Error updating users:", err);
//   } finally {
//     // 3. Close DB connection
//     await mongoose.disconnect();
//     console.log("MongoDB disconnected.");
//   }
// }

// // Run only once
// addCreatedAtToOldUsers();
