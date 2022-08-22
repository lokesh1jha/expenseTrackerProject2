const User = require('../models/user');
const bcrypt = require('bcrypt');


exports.registerUser = (req, res, next) => {
    const {name, email,phone, password} = req.body;
    console.log(req.body);
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            //Store hash in your password DB
            if(err){
                console.log('Unable to create new user');
                res.json({message:  'Unable to create new user'});
            }
            User.create({name, email, phone, password:hash})
                .then(() => {
                    res.status(201).json({message: "Successful create new user"})
                })
                .catch(err => {
                    res.status(403).json({sucess: false, error: err})
                    console.log("error " + err.message);
                })
        })
    })
};

//For login
// const comparePassword = async (password, hash) => {
//     try {
//         // Compare password
//         return await bcrypt.compare(password, hash);
//     } catch (error) {
//         console.log(error);
//     }

//     // Return false if error
//     return false;
// };

// const isValidPass = bcrypt.compareSync(password, hash);
// console.log(isValidPass);