const {accountEmail, transporter} = require('../config/nodemailer.js')

const generateEmailWelcome = (fullName, email) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; padding: 20px 30px; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800;">EventGarden</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">                
                <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${fullName}</strong>,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Your account with this <strong>${email}</strong> has been successfully created .</p>
                
                
                <p style="font-size: 16px; margin-bottom: 25px;">Thank you for joining us at EventGarden, We are excited to have you join our community. We hope you find the Event of a lifetime</p>
                
                <p style="font-size: 16px; margin-top: 30px;">If you'd like to make changes, please <a href="http://localhost:3000/auth/sign-in" target="_blank" style="color: #4a90e2; text-decoration: none;">Log In</a> through your account anytime.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The EventGarden Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    EventGarden. | Hacktiv8, Pondok Indah, Jakarta Selatan
                </p>
            </td>
        </tr>
    </table>
</div>
`;


const generateEmailReservation = (
    fullName,
    title,
    location,
    eventDate,
) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; padding: 20px 30px; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800;">EventGarden</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">                
                <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${fullName}</strong>,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Your reservation to <strong>${title}</strong> has been successfully </p>
                
                <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 10px; margin-bottom: 25px;">
                    <tr>
                        <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Event:</strong> ${title}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Location:</strong> ${location}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px;">
                            <strong>Event Date:</strong> ${eventDate}
                        </td>
                    </tr>
                </table>
                
                <p style="font-size: 16px; margin-bottom: 25px;">If you'd like to make changes or cancel your reservation, you can go to your <a href="http://localhost:3000/profile/events" style="color: #4a90e2; text-decoration: none;">My Event Page</a> before the event date.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The EventGarden Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    EventGarden. | Hacktiv8, Pondok Indah, Jakarta Selatan
                </p>
            </td>
        </tr>
    </table>
</div>
`;


const sendWelcomeEmail = async (fullName, email) => {
    try {
        const message = generateEmailWelcome(fullName, email)

        const mailOption = {
            from: accountEmail,
            to: email,
            subject: 'Welcome to EventGarden!',
            html: message
        }

        await transporter.sendMail(mailOption)
        console.log(`welcome email sent to ${email}`);
        
    } catch (error) {
        throw error
    }
}

const sendReservationEmail = async (email, fullName, title, location, eventDate) => {
    try {
        const message = generateEmailReservation(fullName, title, location, eventDate)

        const mailOption = {
            from: accountEmail,
            to: email,
            subject: 'Thank you for the reservation!',
            html: message
        }

        await transporter.sendMail(mailOption)
        console.log(`Reservation email sent to ${email}`);
        
    } catch (error) {
        throw error
    }
}


module.exports = {sendWelcomeEmail, sendReservationEmail}