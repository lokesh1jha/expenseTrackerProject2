// const User = require('../models/user');

exports.registerUser = (req, res, next) => {
    
  console.log(req.body);
  res.status(200).json({ sucess: true, message: "Product added sucessfully" });
};