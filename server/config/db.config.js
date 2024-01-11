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
  HOST: dbUrl.hostname,
  PORT: dbUrl.port,
  USER: dbUrl.username,
  PASSWORD: dbUrl.password,
  DB: dbUrl.pathname.slice(1), // remove the leading '/'
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};