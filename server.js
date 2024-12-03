require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const {
  createKey,
  createKeyAndSendEmail,
  activateKey,
  verifyKey,
} = require("./controller");

const app = express();
const PORT = process.env.PORT || 3211;
app.use(bodyParser.json());

app.post("/createKey", createKey);

app.post("/createKeyAndSendEmail", createKeyAndSendEmail);

app.post("/activateKey", activateKey);

app.get("/verifyKey", verifyKey);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
