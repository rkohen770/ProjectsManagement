import { createContext } from 'react';

const project={
    id: "default project",
    name: "default project",
    description: "default project",
    doc: "",
    tasks:[],
}

export const ProjectContext = createContext(project);
