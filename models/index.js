const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Accept self-signed certs if needed
        },
    },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./user.model")(sequelize, Sequelize);

module.exports = db;