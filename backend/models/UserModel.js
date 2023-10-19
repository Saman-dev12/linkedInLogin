const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  linkedinId: String, // Unique identifier for the LinkedIn user
  firstName: String,
  lastName: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
