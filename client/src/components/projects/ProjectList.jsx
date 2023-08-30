import { useState, useEffect } from "react";
import { fetchProjects } from "../../services/projectService";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // API call to get projects
    fetchProjects().then((projects) => setProjects(projects));
  }, []);

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
