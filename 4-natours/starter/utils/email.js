const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Shan Mi <shanmi@shanmi.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: we can transfer text to html here
  };

  // 3) Actually send the email w/ nodemailer
  // return a promise
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
