const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.project = require("../models/project.model.js")(sequelize, Sequelize);
db.task = require("../models/task.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.user.belongsToMany(db.project, {
  through: 'ProjectEmployees',
  as: 'projects',
  foreignKey: 'userId'
});
db.project.belongsToMany(db.user, {
  through: 'ProjectEmployees',
  as: 'employees',
  foreignKey: 'projectId'
});

db.user.hasMany(db.task, {
  foreignKey: 'employeeId',
  as: 'tasks'
});
db.task.belongsTo(db.user, {
  foreignKey: 'employeeId',
  as: 'employee'
});

db.project.hasMany(db.task, {
  foreignKey: 'projectId',
  as: 'tasks'
});
db.task.belongsTo(db.project, {
  foreignKey: 'projectId',
  as: 'project'
});

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.ROLES = ["user", "admin", "employee"];

module.exports = db;