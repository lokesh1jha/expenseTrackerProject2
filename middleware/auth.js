const User = require('../models/user');
const jwt = require('jsonwebtoken');

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

module.exports = {
    authenticate
}