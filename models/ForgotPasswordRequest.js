const Sequelize =require('sequelize');
const sequilize = require('../util/database');

const ForgotPasswordRequest = sequilize.define('ForgotPasswordRequest', {
    id: {
        // this is a uuid (unique identifier just like id but it is normally a long string so that other people cannot guess ) Use this library to generate UUIDS https://www.npmjs.com/package/uuid
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    isactive: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = ForgotPasswordRequest;