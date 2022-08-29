
exports.forgotpassword = (req, res, next) => {
    try {
        console.log("Forgot Password" + req)

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: 'lokesh1jha@gmail.com', // Change to your recipient
            from: 'ceolokeshjha@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })


        return res.status(200).json({ success: true })
    }
    catch (err) {
        return res.status(200).json({ error: err, success: false })
    }
};