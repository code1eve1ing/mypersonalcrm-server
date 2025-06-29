const { encryptField } = require("../utils/crypto");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        agreedToPolicy: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        activePlan: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    User.beforeCreate(async (user) => {
        if (user.mobile) user.mobile = encryptField(user.mobile);
        if (user.password) user.password = encryptField(user.password);
    });

    return User;
};