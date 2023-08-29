const express = require("express");
const bcrypt = require("bcryptjs");

// Load middleware
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
require("../server/routes/auth.routes")(app);
require("../server/routes/user.routes")(app);

// Load environment variables
require("dotenv").config();
const port = process.env.PORT;

var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

app.use(helmet());

const db = require("./models");
const { signin } = require("./controllers/auth.controller");
const Role = db.role;
const User = db.user;

// basic user signup
const admin = {
  username: "admin",
  email: "admin@test",
  password: "0770",
  roles: ["admin", "user"],
};

const mod = {
  username: "mod",
  email: "mod@test",
  password: "0770",
  roles: ["moderator", "user"],
};

const user = {
  username: "user",
  email: "user@test",
  password: "0770",
  roles: ["user"],
};

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
app.listen();
