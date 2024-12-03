const nodemailer = require("nodemailer");

//criar senha indo https://myaccount.google.com/ e criando um app password (busca)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"forPOE" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    //console.log("Email enviado: %s", info.messageId);
    return { success: true };
  } catch (error) {
    //console.error("Erro ao enviar email:", error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
