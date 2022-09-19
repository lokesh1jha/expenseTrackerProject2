const Expense = require('../models/expense');
const AWS = require('aws-sdk');
const { response } = require('express');

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
        expense = paginationResult(req, expense);
        return res.status(200).json({ expense, success: true })
    }).catch(err => {
        return res.status(402).json({ error: err, success: false })
    })
}


const paginationResult = function pagination(req, model) {
    try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const result = {};

            if (endIndex < model.length) {
                result.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                result.previous = {
                    page: page - 1,
                    limit: limit
                }
            }

            
            result.lastPage = Math.floor((model.length - 1) / limit);

            result.results = model.slice(startIndex, endIndex);

            return result;
    }
    catch (err) {
        console.log('err :' + err);
    }
}



exports.deleteexpense = (req, res) => {
    const expenseid = parseInt(req.query.id);
    console.log(expenseid + "expeseid")
    Expense.destroy({ where: { id: expenseid } }).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly" })
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed to Delete" })
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
    return res.status(200).json({ success: true })
    //All users name and expense : order by Total expense amount

}

async function uploadTOS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    // s3bucket.createBucket(() => {
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }
        // return new Promise((resolve, reject) => {
        //     s3bucket.upload(params, (err, s3response) => {
        //         if (err) {
        //             console.log('Something went wrong', err);
        //             reject(err);
        //         } else {
        //             console.log('sucess', s3response);
        //             resolve(s3response.Location);
        //         }
        //     })
        // }
        const s3response = await s3bucket.upload(params).promise();
        if(s3response) { 
            return s3response.Location;
        }
       
}

exports.downloadExpense = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        // console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const id = req.user.id;
        const filename = `MyExpense${id}/${new Date()}.txt`;
        const fileURL = await uploadTOS3(stringifiedExpenses, filename);
        // console.log("fileURL: " + fileURL);
        return res.status(201).json({ success: true, fileURL });
    } catch (err) {
        console.log("Exception", err);
        return res.status(500).json({ success: false, fileURL: "", err: err });
    }
}