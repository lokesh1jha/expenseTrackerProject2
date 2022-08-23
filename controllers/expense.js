const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.registerUser = (req, res, next) => {
    const { name, email, phone, password } = req.body;
    console.log(req.body);
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            //Store hash in your password DB
            if (err) {
                console.log('Unable to create new user');
                res.json({ message: 'Unable to create new user' });
            }
            User.create({ name, email, phone, password: hash })
                .then(() => {
                    res.status(201).json({ message: "Successful create new user" })
                })
                .catch(err => {
                    res.status(403).json({ sucess: false, error: err })
                    console.log("error " + err.message);
                })
        })
    })
};


function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOCKEN_SECRET);
}

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    console.log(password);
    User.findAll({ where: { email } }).then(user => {
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function (err, response) {
                if (err) {
                    console.log(err)
                    return res.json({ success: false, message: 'Something went wrong' })
                }
                if (response) {
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    res.json({ token: jwttoken, success: true, message: 'Successfully Logged In' })
                    // Send JWT
                } else {
                    // response is OutgoingMessage object that server response http request
                    return res.status(401).json({ success: false, message: 'passwords do not match' });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: 'passwords do not match' })
        }
    })
}
const authenticate = (req, res, next) => {
    try {
        const tocken = req.header('authorization');
        console.log('tocken : ' + tocken);
        const userid = Number(jwt.verify(tocken, process.env.TOCKEN_SECRET));
        User.findByPk(userid).then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        })
            .catch(err => { throw new Error(err) })
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false })
    };
}

exports.addexpense = (req, res, next) => {
    const { expenseamount, description, category } = req.body;
    console.log(`req.user>>>>${JSON.stringify(req.user)}`);
    req.user.createExpense({ expenseamount, description, category })
        .then(expense => {
            return res.status(201).json({ expense, success: true });
        })
        .catch(err => {
            return res.status(402).json({ success: false, error: err });
        })
};

exports.getexpense = (req, res, next) => {

}