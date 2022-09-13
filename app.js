const express = require('express')
const body_parser = require('body-parser')

const path = require('path')
const cors = require('cors')

const sequelize = require('./util/database');
const User = require('./models/user')
const Expense = require('./models/expense')
const ForgotPasswordRequest = require('./models/ForgotPasswordRequest')

const userRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const forgotPassRoute = require('./routes/forgotPass')

const app = express();
const dotenv = require('dotenv');
const Order = require('./models/orders');

//get config vars
dotenv.config();

app.use(cors());


app.use(body_parser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/password', forgotPassRoute)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User)

ForgotPasswordRequest.belongsTo(User);
User.hasMany(ForgotPasswordRequest);


sequelize
//   .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
