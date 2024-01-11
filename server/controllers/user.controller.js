const db = require("../models");
const fs = require("fs");
const os = require("os");
const path = require("path");
const User = db.user;
const s3 = require("./s3.controller");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.employeeBoard = (req, res) => {
  res.status(200).send("Employee Content.");
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.userName) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a User
    const user = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

exports.findAllByRole = (req, res) => {
    const role = req.params.role;
    User.findAll({ where: { role: role } })
        .then(async (data) => {
            await Promise.all(data.map(async (item) => {
                item.dataValues.avatar = await s3GetSingedUrl(item.dataValues.avatar);
            }));

            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Users with role=" + role
            });
        });
};

exports.findAll = (req, res) => {
    User.findAll()
    .then(async (data) => {
        await Promise.all(data.map(async (item) => {
            item.dataValues.avatar = await s3GetSingedUrl(item.dataValues.avatar);
        }));

        res.status(200).send(data);
    })
    .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(async (data) => {
            const S3avatar = await s3GetSingedUrl(data.dataValues.avatar);
            data.dataValues.avatar = S3avatar;
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    if(req.body.avatar && !req.body.avatar?.includes("http")) {
        const imagePath = path.join(os.tmpdir(), req.body.avatar);
        const avatarFile = fs.readFileSync(imagePath);
        if (avatarFile) {
            const avatarName = `${req.body.email}-avatar-${req.body.avatar}`;
            req.body.avatar = avatarName;
            s3.s3Uploader(avatarName, avatarFile).then().catch((err) => {
                res.status(500).send({ message: err });
                return;
            });
        }
    } 

    User.update(req.body, {
        where: { id: id }
    })
        .then(async num => {
            if (num == 1) {
                User.findByPk(id)
                .then(async (data) => {
                    data.dataValues.avatar = await s3GetSingedUrl(data.dataValues.avatar);
                    res.status(200).send({
                        message: "User was updated successfully.",
                        user: data.dataValues
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error retrieving User with id=" + id
                    });
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

//get signed url from s3
async function s3GetSingedUrl(fileName) {
    if (!(fileName.includes("/") || fileName.includes("\\"))) {
      try {
        return await s3.s3GetSingedUrl(fileName);
      } catch (err) {
        console.log(err);
      }
    }
    else {
      return fileName;
    }
}