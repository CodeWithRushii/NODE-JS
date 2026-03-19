const nodemailer = require('nodemailer');

const sendRegisterAdminMail = async (email, password) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_USER_PASS,
        }
    });

    const mailOptions = {
        from: `"E-Commerce App" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Admin Access",
        html: `
            <h2>Admin Panel Access</h2>
            <p><b>Email :</b> ${email}</p>
            <p><b>Password :</b> ${password}</p>
            <p><b>Website:</b> <a href='www.jiohotstar.com'>Link</a> </p>
        `,
    };

    await transport.sendMail(mailOptions);
}

const sendOTPMail = async (to, OTP) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_USER_PASS,
        }
    });

    const mailOptions = {
        from: `"E-Commerce App" <${process.env.MAIL_USER}>`,
        to: to,
        subject: "Forgot Password",
        html: `<p>OTP : <b>${OTP}</b></p>`,
    };

    await transport.sendMail(mailOptions);
}

module.exports = { sendOTPMail, sendRegisterAdminMail };