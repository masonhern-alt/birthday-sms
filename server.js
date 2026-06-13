require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.urlencoded({ extended: false }));

const employees = {
  "SARAH": "+14355550101",
  "MIKE":  "+14355550102",
  "JESS":  "+14355550103",
};
app.post("/sms", async (req, res) => {
  const incomingBody = req.body.Body?.trim() || "";
  const [keyword, ...rest] = incomingBody.split(" ");
  const employeeNumber = employees[keyword?.toUpperCase()];

  if (!employeeNumber) {
    return res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>We did not recognize that name. Try: SARAH Happy Birthday!</Message></Response>');
  }

  const customerMessage = rest.join(" ");

  if (!customerMessage) {
    return res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Got it! Now add your message. Example: SARAH Happy Birthday!</Message></Response>');
  }
  try {
    await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: employeeNumber,
        message: "A customer wishes you: " + customerMessage,
        key: process.env.TEXTBELT_API_KEY,
      }),
    });

    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Your birthday message was sent! They are going to love it!</Message></Response>');
  } catch (err) {
    console.error(err);
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Something went wrong. Please try again!</Message></Response>');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));