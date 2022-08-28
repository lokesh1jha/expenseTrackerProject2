const User = require('../models/user');
const Expense = require('../models/expense');

exports.addExpense = (req, res, next) => {
    const { expenseamount, description, category } = req.body;
    req.user.createExpense({ expenseamount, description, category })
        .then(expense => {
            return res.status(201).json({ expense, success: true });
        })
        .catch(err => {
            return res.status(403).json({ success: false, error: err });
        })
};

exports.getExpense = (req, res, next) => {
    req.user.getExpenses().then(expense => {
        return res.status(200).json({expense, success:true})
    }).catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

exports.leaderboard = (req, res, next) => {
    //user name and total expense
    // Expense.findAll({
    //     attributes: [userId, [sequelize.fn('sum', sequelize.col('expenseamount')), 'total']],
    //     group: "userId",
    //     order: ["total", "ASC"],
    // }).then(expenses => {
    //     return res.status(200).json({expenses, success: true})
    // })
    console.log('leaderboard backend')
    return res.status(200).json({success: true})
    //All users name and expense : order by Total expense amount

}