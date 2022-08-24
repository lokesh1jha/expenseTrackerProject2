const express = require('express')
const body_parser = require('body-parser')

const path = require('path')
const cors = require('cors')

const sequelize = require('./util/database');
const User = require('./models/user')
const Expense = require('./models/expense')

const userRoutes = require('./routes/expense');

const app = express();
const dotenv = require('dotenv');

//get config vars
dotenv.config();

app.use(cors());


app.use(body_parser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
//   .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
