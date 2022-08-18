const express = require('express')
const body_parser = require('body-parser')

const path = require('path')
const cors = require('cors')

//const sequelize = require('./controllers/error')

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

app.listen(3000);