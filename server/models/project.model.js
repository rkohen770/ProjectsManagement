module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("project", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        deadline: {
            type: Sequelize.DATE
        }
    });

    Project.associate = models => {
        Project.belongsTo(models.User, {
            foreignKey: 'managerId',
            as: 'manager'
        });
        Project.belongsToMany(models.User, {
            through: 'ProjectEmployees',
            as: 'employees',
            foreignKey: 'projectId'
        });
    };

    return Project;
};