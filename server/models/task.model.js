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
        deadLine: {
            type: Sequelize.DATE
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        projectId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    Task.associate = models => {
        Task.belongsTo(models.User, {
            foreignKey: 'employeeId',
            as: 'employee',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION' 
        });
        Task.belongsTo(models.Project, {
            foreignKey: 'projectId',
            as: 'project',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION' 
        });
    };

    return Task;
};