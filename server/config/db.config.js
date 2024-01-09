// module.exports = {
//   HOST: "localhost",
//   PORT: 3306,
//   USER: "root",
//   PASSWORD: "rkohen770",
//   DB: "projectManagement",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };

// Parse the DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

module.exports = {
<<<<<<< HEAD
  HOST: "localhost",
  PORT: 3306,
  USER: "root",
  PASSWORD: "Ori323115956",
  DB: "projectManagement",
=======
  HOST: dbUrl.hostname,
  PORT: dbUrl.port,
  USER: dbUrl.username,
  PASSWORD: dbUrl.password,
  DB: dbUrl.pathname.slice(1), // remove the leading '/'
>>>>>>> 6e39fca12e63670a4b73e2dc916926d46c3569a4
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};