/* eslint-disable no-unused-vars */
async function fetchProjects() {
  const response = await fetch("/api/projects");
  const data = await response.json();

  return data;
}

async function submitProject(name, description) {
  const project = { name, description };

  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error submitting project");
  }
}

async function deleteProject(id) {
    const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
    });
    
    if (!response.ok) {
        throw new Error("Error deleting project");
    }
    }

export { fetchProjects, submitProject, deleteProject };