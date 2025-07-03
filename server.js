const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

(async () => {
    sequelize.sync().then((i) => {
        console.log('Connected to', i.config.database)
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }).catch(err => {
        console.log('Failed to connect with database:', err)
    });
})();