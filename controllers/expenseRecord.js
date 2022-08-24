const User = require('../models/user');

exports.addExpense = (req, res, next) => {
    const { expenseamount, description, category } = req.body;
    console.log(`req.user>>>>${JSON.stringify(req.user)}`);
    req.user.createExpense({ expenseamount, description, category })
        .then(expense => {
            return res.status(201).json({ expense, success: true });
        })
        .catch(err => {
            return res.status(403).json({ success: false, error: err });
        })
};

exports.getExpense = (req, res, next) => {
    console.log(`req.user12345>>>>`);
    req.user.getExpenses().then(expense => {
        console.log(`req.user65432>>>>`);
        return res.status(200).json({expense, success:true})
    }).catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}