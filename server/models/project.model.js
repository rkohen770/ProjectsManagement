module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("project", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        deadLine: {
            type: Sequelize.DATE
        },
        doc: {
            type: Sequelize.STRING
        },
    });

    Project.associate = models => {
        Project.belongsTo(models.User, {
            foreignKey: 'managerId',
            as: 'manager',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION' 
        });
        Project.belongsToMany(models.User, {
            through: 'ProjectEmployees',
            as: 'employees',
            foreignKey: 'projectId',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION' 
        });
    };

    return Project;
};