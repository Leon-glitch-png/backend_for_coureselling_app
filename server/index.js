const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/", (req, res) => {
  res.send("Welcome to Course Selling Website");
})

mongoose.connect("mongodb+srv://dbUser:dbUserPassword@cluster0.kfjyvcn.mongodb.net/")



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});