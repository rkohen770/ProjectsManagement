const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // We are running in production mode
  const dbUrl = new URL(process.env.DATABASE_URL);
  const auth = dbUrl.username ? dbUrl.username : dbUrl.password ? dbUrl.password.split(':') : [];

  sequelize = new Sequelize(dbUrl.pathname.slice(1), auth[0], auth[1], {
    host: dbUrl.hostname,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Planetscale uses self-signed certificates
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // We are running in development mode
  sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Planetscale uses self-signed certificates
      }
    },
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
  });
}

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
  foreignKey: 'userId',
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});
db.project.belongsToMany(db.user, {
  through: 'ProjectEmployees',
  as: 'employees',
  foreignKey: 'projectId',
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});

db.user.hasMany(db.task, {
  foreignKey: 'employeeId',
  as: 'tasks',
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});
db.task.belongsTo(db.user, {
  foreignKey: 'employeeId',
  as: 'employee',
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});

db.project.hasMany(db.task, {
  foreignKey: 'projectId',
  as: 'tasks',
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});
db.task.belongsTo(db.project, {
  foreignKey: 'projectId',
  as: 'project',
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});

db.role.belongsToMany(db.user, {
  through: "user_roles",
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  onDelete: 'NO ACTION', // Add this line
  onUpdate: 'NO ACTION'  // Add this line
});

db.ROLES = ["user", "admin", "employee"];

module.exports = db;