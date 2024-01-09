module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
      userName: {
          type: Sequelize.STRING
      },
      email: {
          type: Sequelize.STRING,
          validate: {
              isEmail: true
          }
      },
      password: {
          type: Sequelize.STRING
      },
      role: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              isIn: [['admin', 'manager', 'employee']]
          }
      },
      firstName: {
          type: Sequelize.STRING
      },
      lastName: {
          type: Sequelize.STRING
      },
      avatar: {
          type: Sequelize.STRING
      },
  });

  return User;
};