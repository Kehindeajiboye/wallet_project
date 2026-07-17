require("dotenv").config();
const express = require("express");
const userRoute = require("./src/routes/userRoute");
const walletRoute = require("./src/routes/walletRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const port = process.env.PORT;

app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hello World",
      version: "1.0.0",
    },
    contact: [
      {
        name: "Kehinde Ajiboye",
        email: "ajiboyekehinde194@gmail.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  servers: [{url: `http://localhost:${port}`}],
  apis: ["./src/routes/*.js"], // files containing annotations as above
};

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("You don miss road");
});

app.use("/user", userRoute);
app.use("/wallet", walletRoute);
