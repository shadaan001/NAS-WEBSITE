import nodemailer from 'nodemailer';

async function sendEmail(to: string, sub: string, body: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nasrevolutioncentre@gmail.com',
            pass: 'bcsu nxvn brdz plmi',
        },
    });

    const mailOptions = {
        from: 'nasrevolutioncentre@gmail.com',
        to,
        subject: sub,
        html: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export default sendEmail;