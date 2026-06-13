require("dotenv").config();
const express = require("express");
const twilio = require("twilio");

const app = express();
app.use(express.urlencoded({ extended: false }));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const employees = {
  "Jose": "+14352517688",  // ← replace with real numbers
};

app.post("/sms", async (req, res) => {
  const incomingBody = req.body.Body?.trim() || "";
  const [keyword, ...rest] = incomingBody.split(" ");
  const employeeNumber = employees[keyword?.toUpperCase()];

  const twiml = new twilio.twiml.MessagingResponse();

  if (!employeeNumber) {
    twiml.message(`We didn't recognize that name. Try: SARAH Happy Birthday! 🎂`);
    return res.type("text/xml").send(twiml.toString());
  }

  const customerMessage = rest.join(" ");

  if (!customerMessage) {
    twiml.message(`Got it! Now add your message. Example: ${keyword} Happy Birthday! 🎉`);
    return res.type("text/xml").send(twiml.toString());
  }

  try {
    await client.messages.create({
      body: `🎂 A customer wishes you: "${customerMessage}"`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: employeeNumber,
    });
    twiml.message(`Your birthday message was sent! They're going to love it 🎉`);
  } catch (err) {
    console.error(err);
    twiml.message(`Something went wrong. Please try again!`);
  }

  res.type("text/xml").send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));