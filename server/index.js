require('dotenv').config();
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
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/project.routes')(app);
require('./routes/task.routes')(app);

const db = require("./models");
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



