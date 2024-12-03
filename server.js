require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { createKey, createKeyAndSendEmail, activateKey } = require("./controller");

const app = express();
const PORT = 3211 || process.env.PORT;
app.use(bodyParser.json());

app.post("/createKey", createKey);

app.post("/createKeyAndSendEmail", createKeyAndSendEmail);

app.post("/activateKey", activateKey);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
