const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5001;
const authRouter = require("./routes/authRoute");
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
mongoose.set("strictQuery", false);
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
