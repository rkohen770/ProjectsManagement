
// export function AdminHome() {
//   return (
//     <div className="container">
//       <header className="jumbotron">
//         <h3>Admin Home</h3>
//       </header>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { getProjects, getTasks } from '../api'; // Replace with your actual API functions

export function AdminHome() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // Fetch projects
    getProjects().then((projectsData) => setProjects(projectsData));

    // Fetch tasks
    getTasks().then((tasksData) => setTasks(tasksData));

    
  }, []);

  return (
    <div>
      <h1>Admin Home Page</h1>

      {/* Display Ongoing Projects */}
      <div>
        <h2>Ongoing Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      </div>

      {/* Display Tasks */}
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

