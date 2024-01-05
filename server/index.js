const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:5173"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
require('../server/routes/auth.routes')(app);
require('../server/routes/user.routes')(app);
require('../server/routes/project.routes')(app);
require('../server/routes/task.routes')(app);

const db = require("../server/models");
const Role = db.role;

db.sequelize.sync({ force: false }).then(() => {
  console.log('Resync Db');
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "hello from express" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "employee"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}



// const express = require("express");
// const bcrypt = require("bcryptjs");

// // Load middleware
// const cors = require("cors");
// const helmet = require("helmet");

// const app = express();

// // parse requests of content-type - application/json
// app.use(express.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// // routes
// require("../server/routes/auth.routes")(app);
// require("../server/routes/user.routes")(app);

// // Load environment variables
// require("dotenv").config();
// const port = process.env.PORT;

// var corsOptions = {
//   origin: "http://localhost:8081",
// };
// app.use(cors(corsOptions));

// app.use(helmet());

// const db = require("./models");
// const { signin } = require("./controllers/auth.controller");
// const Role = db.role;
// const User = db.user;

// // basic user signup
// const admin = {
//   username: "admin",
//   email: "admin@test",
//   password: "0770",
//   roles: ["admin", "user"],
// };

// const mod = {
//   username: "mod",
//   email: "mod@test",
//   password: "0770",
//   roles: ["employee", "user"],
// };

// const user = {
//   username: "user",
//   email: "user@test",
//   password: "0770",
//   roles: ["user"],
// };

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });

//   Role.create({
//     id: 2,
//     name: "employee",
//   });

//   Role.create({
//     id: 3,
//     name: "admin",
//   });
// }

// app.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
// app.listen();
