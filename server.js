require("dotenv").config();
const express = require("express");
const CORS = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./routers/router");

// creating the testing express app
const app = express();

// connecting to mongoose
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb://0.0.0.0:27017/testFiveMonths",
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDB connected to your app!");
    }
  }
);

app.use(express.json());
app.use(
  CORS({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(router);

// app.patch("/:id", (req, res) => {
//   const id = req.params.id;
// });
// creating a port for my server
const PORT = 5000;
app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Your app is running on port ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", +err);
  }
});
