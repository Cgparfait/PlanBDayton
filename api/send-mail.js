const nodemailer = require('nodemailer');

async function sendEmail(from, to, subject, text) {
    const mailOptions = { from: `"${from}" <${process.env.GMTP_USER}>`, to: to, subject: subject, text: text };
    const transporter = getMailTransporter("gmail", process.env.GMTP_USER, process.env.PASS);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

function getMailTransporter(service, user, password) {
    return nodemailer.createTransport({
        service: service, // Use Gmail as the email service
        auth: { user: user, pass: password },
        tls: { rejectUnauthorized: false },// Disable certificate verification
    });
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    
    try {

        const {
            name,
            phone,
            email,
            propertyAddress,
            state,
            zip,
            sellingReason,
            sellingTimeframe,
        } = req.body;

        const emailSubject = "🚀 New Lead Alert: PlanBDayton Received a Message";
        const emailBody = `
Hello PlanBDayton Team,

You have received a new contact submission. Here are the details:

Name: ${name}
Phone: ${phone}
Email: ${email}

Property Information:
Address: ${propertyAddress}
State: ${state}
ZIP Code: ${zip}

Selling Details:
Reason for Selling: ${sellingReason}
Timeframe for Selling: ${sellingTimeframe}

Please review this submission and reach out to the contact promptly.

Thank you,
PlanBDayton Notification System
    `;

        let data = await sendEmail(process.env.EMAIL_FROM, process.env.EMAIL_TO, emailSubject, emailBody);
        console.log(data)
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send email", error: error.message });
    }
}