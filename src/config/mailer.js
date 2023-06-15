import nodemailer from "nodemailer";

const contaTeste = await nodemailer.createTestAccount();

//Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  auth: contaTeste
});

async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: "todo-list-v2@hfcsolucoes.com.br",
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail sent successfully");
  } catch (error) {
    console.log("Error sending e-mail: ", error);
  }
}

export default sendEmail;
