// fixCreatedAt.js
const mongoose = require("mongoose");
const User = require("./models/User");

const uri = "mongodb://127.0.0.1:27017/yourdbname";

mongoose.connect(uri).then(async () => {
  console.log("Connected");

  const result = await User.updateMany(
    { createdAt: { $exists: false } },
    { $set: { createdAt: new Date() } }
  );

  console.log("Users updated:", result.modifiedCount);
  mongoose.disconnect();
});
