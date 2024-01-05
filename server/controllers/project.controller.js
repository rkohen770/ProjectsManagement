const db = require("../models");
const Project = db.project;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Project
    const project = {
        name: req.body.name,
        description: req.body.description,
        deadline: req.body.deadline,
        managerId: req.body.managerId
    };

    // Save Project in the database
    Project.create(project)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Project."
            });
        });
};

exports.findAll = (req, res) => {
    Project.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving projects."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Project.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Project with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Project.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Project was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Project with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Project.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Project was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Project with id=${id}. Maybe Project was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Project with id=" + id
            });
        });
};