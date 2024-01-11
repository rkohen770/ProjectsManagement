const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new User
  app.post("/api/users", controller.create);

  // Retrieve all Users
  app.get("/api/users", controller.findAll);

  // Retrieve all Users by role
  app.get("/api/users/:role", controller.findAllByRole);

  // Retrieve a single User with id
  app.get("/api/users/getUser/:id", controller.findOne);

  // Update a User with id
  app.put("/api/users/:id", controller.update);

  // Delete a User with id
  app.delete("/api/users/:id", controller.delete);

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/emp",
    [authJwt.verifyToken, authJwt.isEmployee],
    controller.employeeBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};