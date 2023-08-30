import { useState } from 'react';
import { submitProject } from '../../services/projectService';


function ProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    
    // Submit form data to API
    submitProject(name, description);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={name}
        onChange={e => setName(e.target.value)} 
        placeholder="Project name"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Project description" 
      />
      <button type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm;