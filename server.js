require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.urlencoded({ extended: false }));

const employees = {
  "SARAH": "+14355550101",  // ← replace with real numbers
  "MIKE":  "+14355550102",
  "JESS":  "+14355550103",
};

app.post("/sms", async (req, res) => {
  const incomingBody = req.body.Body?.trim() || "";
  const [keyword, ...rest] = incomingBody.split(" ");
  const employeeNumber = employees[keyword?.toUpperCase()];

  if (!employeeNumber) {
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response><Message>We didn't recognize that name. Try: SARAH Happy Birthday! 🎂</Message></Response>`);
  }

  const customerMessage = rest.join(" ");

  if (!customerMessage) {
    return res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response><Message>Got it! Now add your message. Example: ${keyword} Happy Birthday! 🎉</Message></Response>`);
  }

  try {
    await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: employeeNumber,
        message: `🎂 A customer wishes you: "${customerMessage}"`,
        key: process.env.TEXTBELT_API_KEY,
      }),
    });

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response><Messa