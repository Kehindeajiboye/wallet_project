require("dotenv").config();
const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use("/", (req, res) => {
  res.send("You don miss road");
});

app.use("/user", userRoutes);
