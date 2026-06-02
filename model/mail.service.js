const nodemailer = require("nodemailer");
const ApiError = require("../authcontroller/api-error");

function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });
  return transporter;
}

async function sendMail(input) {
  try {
    const mailTransporter = createTransporter();

    const info = await mailTransporter.sendMail({
      from: process.env.GMAIL_USER,
      to: input.email,
      subject: "Email Confirmation",
      text: `This is your confirmation code: ${input.code}`,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (err) {
    throw new ApiError("Error while sending mail:", 400);
  }
}

module.exports = { sendMail };
