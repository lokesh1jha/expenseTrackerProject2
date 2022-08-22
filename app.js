const express = require('express')
const body_parser = require('body-parser')

const path = require('path')
const cors = require('cors')

const sequelize = require('./util/database');

const app = express()

app.use(cors())

const dotenv = require('dotenv');
//get config vars
dotenv.config();

app.use(cors());

//app.set

// const adminRoutes = require('.route/admin')
const publicRoutes = require('./routes/expense')

app.use(body_parser.json());
app.use(express.static(path.join(__dirname, 'public')));

//login
// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
// });

// app.use('/admin', adminRoutes);
app.use(publicRoutes);

// app.use(errorController.get404);

// .belongsTo(User, {})

sequelize
//   .sync({ force: true })
  .sync()
  .then(result => {
    // return User.findByPk(1);
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
