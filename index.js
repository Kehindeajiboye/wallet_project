require("dotenv").config();
const express = require("express");
const userRoute = require("./src/routes/userRoute");
const walletRoute = require("./src/routes/walletRoute");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use("/", (req, res) => {
  res.send("You don miss road");
});

app.use("/user", userRoute);
app.use("/wallet", walletRoute);
