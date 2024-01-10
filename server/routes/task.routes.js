const controller = require("../controllers/task.controller");

module.exports = function (app) {
  // Create a new Task
  app.post("/api/tasks", controller.create);

  // Retrieve all Tasks
  app.get("/api/tasks", controller.findAll);

  // Retrieve all Tasks by Project Id
  app.get("/api/tasks/:projectId", controller.findAllByProjectId);

  // Retrieve a single Task with id
  app.get("/api/tasks/:id", controller.findOne);

  // Update a Task with id
  app.put("/api/tasks/:id", controller.update);

  // Delete a Task with id
  app.delete("/api/tasks/:id", controller.delete);
};