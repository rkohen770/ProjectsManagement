const db = require("../models");
const config = require("../config/auth.config");
const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");
const s3 = require("./s3.controller");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  //get the image from the os.tmpdir() directory by the name req.body.avatar
  const imagePath = path.join(os.tmpdir(), req.body.avatar);
  const avatarFile = fs.readFileSync(imagePath);
  const avatarName = `${req.body.email}-avatar-${req.body.avatar}`;
  s3.s3Uploader(avatarName, avatarFile).then().catch((err) => {
    res.status(500).send({ message: err });
    return;
  });

  User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: avatarName,
  })
    .then((user) => {
      if (req.body.role) {
        Role.findAll({
          where: {
            name: req.body.role,
          },
        }).then((role) => {
          user.setRoles(role).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles('employee').then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.tempUpload = (req, res) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, os.tmpdir()); // Save file in the system's temporary directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage: storage }).single('temp');

  upload(req, res, (err) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      res.status(200).send({ message: "Uploaded successfully!" });
    }
  });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      userName: req.body.userName,
    },
  })
    .then( async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      //if user.avatar is not a path, then it is a file name
      //get the image from the aws s3 bucket by the name user.avatar
      let signedUrl = "";
      if (!(user.avatar.includes("/") || user.avatar.includes("\\"))) {
        try {
          signedUrl = await s3.s3GetSingedUrl(user.avatar);
        } catch (err) {
          console.log(err);
        }
      }

      const clientUser = {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        accessToken: token,
        avatar: signedUrl === "" ? user.avatar : signedUrl,
      };

      res.status(200).send(clientUser);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const updatedUser = updateHelper(req.body);

  User.update(updatedUser,
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
                  message: "User was updated successfully.",
              });
          }
        else {
          res.status(400).send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message:"Error updating User with id=" + id });
    });
}

updateHelper = (updatedUser) => {
  //get the old user by id
  const oldUser = User.findByPk(updatedUser.id);

  let newAvatar = oldUser.avatar;
  if(updatedUser.avatar) {
    try {
      new URL(updatedUser.avatar);
      // If we reach here, then the URL is valid
    } catch (_) {
      const imagePath = path.join(os.tmpdir(), updatedUser.avatar);
      const avatarFile = fs.readFileSync(imagePath);
      const avatarName = `${updatedUser.email}-avatar-${updatedUser.avatar}`;
      s3.s3Uploader(avatarName, avatarFile).then().catch((err) => {
        res.status(500).send({ message: err });
        return;
      });
        newAvatar = avatarName;
      }
    }
  const newUser = {
    userName: updatedUser.userName ? updatedUser.userName : oldUser.userName,
    email: updatedUser.email ? updatedUser.email : oldUser.email,
    password: updatedUser.password ? bcrypt.hashSync(updatedUser.password, 8) : oldUser.password,
    role: oldUser.role,
    firstName: updatedUser.firstName ? updatedUser.firstName: oldUser.firstName,
    lastName: updatedUser.lastName ? updatedUser.lastName: oldUser.lastName,
    avatar: newAvatar,
  };

  return newUser;
}