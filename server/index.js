const express = require("express");
const app = express();

// Load environment variables 
require('dotenv').config();
const port = process.env.PORT

// Load middleware
const cors = require('cors');
const helmet = require('helmet');

app.use(cors()); 
app.use(helmet());






app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
app.listen()
