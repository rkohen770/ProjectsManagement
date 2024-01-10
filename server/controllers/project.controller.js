const db = require("../models");
const Project = db.project;
const path = require("path");
const os = require("os");
const fs = require("fs");
const s3 = require("./s3.controller");

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const filePath = path.join(os.tmpdir(), req.body.doc);
    const docFile = fs.readFileSync(filePath);
    const docName = `${req.body.name}-doc-${req.body.doc}`;
    s3.s3Uploader(docName, docFile).then().catch((err) => {
      res.status(500).send({ message: err });
      return;
    });

    // Create a Project
    const project = {
        name: req.body.name,
        description: req.body.description,
        deadLine: req.body.deadLine,
        doc: docName,
    };

    // Save Project in the database
    Project.create(project)
        .then(data => {
            if(data.dataValues){
                res.status(200).send({
                    message: "Project was created successfully.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Project."
            });
        });
};

exports.findAll = (req, res) => {
    Project.findAll()
    .then(async (data) => {
        await Promise.all(data.map(async (item) => {
            item.dataValues.doc = await s3GetSingedUrl(item.dataValues.doc);
        }));

        res.status(200).send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving projects."
            });
        });
};

//get all projects by user id
exports.findAllByUserId = (req, res) => {
    const id = req.params.id;
    var condition = id ? { managerId: id } : null;

    Project.findAll({ where: condition })
    .then(async (data) => {
        await Promise.all(data.map(async (item) => {
            item.dataValues.doc = await s3GetSingedUrl(item.dataValues.doc);
        }));

        res.status(200).send(data);
    })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving projects." });
        });
};
exports.findOne = (req, res) => {
    const id = req.params.id;

    Project.findByPk(id)
        .then(async (data) => {
            data.dataValues.doc = await s3GetSingedUrl(data.dataValues.doc);
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Project with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    if(req.body.doc){        
        const filePath = path.join(os.tmpdir(), req.body.doc);
        const docFile = fs.readFileSync(filePath);
        const docName = `${req.body.name}-doc-${req.body.doc}`;
        s3.s3Uploader(docName, docFile).then().catch((err) => {
          res.status(500).send({ message: err });
          return;
        });
        req.body.doc = docName;
    }

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

//get signed url from s3
async function s3GetSingedUrl(fileName) {
    try {
        if (!(fileName.includes("/") || fileName.includes("\\"))) {
            return await s3.s3GetSingedUrl(fileName);
        }
        else {
          return fileName;
        }
    } catch (err) {
        console.log(err);
    }
}