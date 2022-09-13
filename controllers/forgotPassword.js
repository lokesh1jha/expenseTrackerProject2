const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgotPasswordRequest = require('../models/ForgotPasswordRequest');

exports.forgotpassword = (req, res, next) => {
    try {
        console.log("Forgot Password" + req.body)
        const { email } = req.body;
        User.findOne({ where: { email } }).then((user) => {
        if (user) {
            const id = uuid.v4();
            console.log(user + " " + id)
            user.createForgotPasswordRequest({ id, isactive: true })
                .catch(err => {
                    throw new Error(err);
                })


            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'ceolokeshjha@gmail.com', // Change to your verified sender
                subject: 'Reset Password Link',
                text: 'Reset Password Link From Expense Tracker',
                html: `<strong>To Reset the Password <a href="http://localhost:3000/password/resetpassword/${id}"> click here </a></strong>`,
            }
            sgMail
                .send(msg)
                .then((response) => {
                    console.log('Email sent')
                    return res.status(response[0].statusCode).json({ message: 'Link to reset password send to resgistred mail id', success: true })
                })
                .catch((error) => {
                    throw new Error(error);
                })
        } else {
            throw new Error('User dosent exist');
        }
    })
    }
    catch (err) {
        console.log(err);
        return res.json({ message: err, success: false })
    }
};

exports.resetpassword = (req, res, next) => {
    const id = req.params.id;
    ForgotPasswordRequest.findOne({ where: { id , isactive: true} })
        .then(ForgotPasswordRequest => {
            if (ForgotPasswordRequest) {
                ForgotPasswordRequest.update({ isactive: false });
                res.status(200).send(`<html>
                <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
                </script>
                <form action="/password/updatepassword/${id}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>Reset Password</button>
                </form>
                </html>`);
                res.end();
            }
        })
}

exports.updatepassword = (req, res, next) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        ForgotPasswordRequest.findOne({ where: { id: resetpasswordid } })
            .then(resetpasswordrequest => {
                User.findOne({ where: { id: resetpasswordrequest.userId } })
                .then((user) => {
                    if (user) {
                        //encrypt the password
                        const saltRounds = 10;
                        bcrypt.genSalt(saltRounds, function (err, salt) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            bcrypt.hash(newpassword, salt, function (err, hash) {
                                //Store hash in your password DB
                                if (err) {
                                    console.log(err);
                                    throw new Error(err);
                                }
                                user.update({ password: hash })
                                    .then(() => {
                                        return res.status(201).json({ message: 'Successfully update the new password' })
                                    })
                            })
                        })
                    } else {
                        return res.status(404).json({ error: 'No User Exist', success: false })
                    }
                })
            })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }
}