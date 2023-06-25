const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Database Error");
  }
};

module.exports = dbConnect;
