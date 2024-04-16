const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
module.exports = sequelize

sequelize.sync();

const app = require("./app");
app.listen(8001, () => console.log(`Dev Server is Running 8001...`));

// TODO: Add cron support
