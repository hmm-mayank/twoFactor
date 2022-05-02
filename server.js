var cors = require("cors");
const express = require("express");
const { SendMessage, SendEmail, emailTemplate } = require("./util");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const app = express();

const port = 3004;

app.use(bodyParser.apply());
app.use(
  cors({
    origin: "*",
    methods: ["post", "get"],
  })
);
app.post("/sendOtp", async (req, res) => {
  const otp = fourDigitCode();
  req.body["uuid"] = uuidv4();
  req.body["serverTimeStamp"] = Math.floor(
    new Date().getTime() / 1000
  ).toString();
  req.body["otp"] = otp;
  const { ip, latLong, userId, userEmail, userPhone, timeStamp } = req.body;
  if (req.query.type == "phone") {
    req.body["type"] = "phone";
    SendMessage("+1", userPhone, `${otp} is your Two Factor Code `).then(
      async (e) => {
        await fs.appendFile("userRecord.json", JSON.stringify(req.body) + ",");
        res.send(req.body);
      }
    );
  } else {
    req.body["type"] = "email";
    SendEmail(
      userEmail,
      emailTemplate(otp),
      "USA Super Admin Two Factor Code."
    ).then(async (e) => {
      console.log(e);
      await fs.appendFile("userRecord.json", JSON.stringify(req.body) + ",");
      res.send(req.body);
    });
  }
});

app.get("/verifyOtp", async (req, res) => {
  let { otp, key, uuid } = req.query;
  let verifyRecord = await fs.readFile("userRecord.json", "utf-8");
  verifyRecord = verifyRecord.slice(0, -1);
  let properData = "[" + verifyRecord + "]";
  properData = JSON.parse(properData);

  let valued = properData.find(
    (e) =>
      e.otp == otp &&
      (e.userPhone === key || e.userEmail === key) &&
      e.uuid === uuid
  );

  if (valued) {
    res.json({ status: true, message: "OTP Valid" });
    return;
  } else {
    res.json({ status: false, message: "OTP Invalid" });
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function fourDigitCode() {
  return Math.floor(1000 + Math.random() * 9000);
}
