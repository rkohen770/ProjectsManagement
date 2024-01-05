module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'todo',
            validate: {
                isIn: [['todo', 'in-progress', 'done']]
            }
        },
        deadline: {
            type: Sequelize.DATE
        }
    });

    Task.associate = models => {
        Task.belongsTo(models.User, {
            foreignKey: 'employeeId',
            as: 'employee'
        });
        Task.belongsTo(models.Project, {
            foreignKey: 'projectId',
            as: 'project'
        });
    };

    return Task;
};