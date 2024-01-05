const controller = require("../controllers/project.controller");

module.exports = function (app) {
  // Create a new Project
  app.post("/api/projects", controller.create);

  // Retrieve all Projects
  app.get("/api/projects", controller.findAll);

  // Retrieve a single Project with id
  app.get("/api/projects/:id", controller.findOne);

  // Update a Project with id
  app.put("/api/projects/:id", controller.update);

  // Delete a Project with id
  app.delete("/api/projects/:id", controller.delete);
};