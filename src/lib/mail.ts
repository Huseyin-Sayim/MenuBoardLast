import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationMail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  const mailOpt = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Hesap Doğrulama',
    html: `
      <h1>Hesabınızı doğrulayın.</h1>
      <h1>Aşağıdaki linke tıklayarak hesabınızı doğrulayın.</h1>
      <a href="${confirmLink}">Hesabımı Doğrula</a>
    `
  }
  await transporter.sendMail(mailOpt);
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Şifre Sıfırlama Kodu',
    html: `
      <h1>Şifre Sıfırlama</h1>
      <p>Şifrenizi sıfırlamak için gereken kod:</p>
      <h2 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${code}</h2>
      <p>Bu kod 15 dakika süreyle geçerlidir.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};