import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { List, Card,  message} from "antd";
import dayjs from 'dayjs';

import { UserContext } from "../../context/user.context";
import { ProjectContext } from "../../context/project.contex";
import ProjectService from "../../services/project.service";
export function EmployeeProjects() {
  const { user, setUser } = useContext(UserContext);

  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fetchData = async () => {
    const response = await ProjectService.getAllProjects();
    if (response.status === 200) {
      setProjects(response.data);
    }
    else {
      console.log(response.message);
      message.error(response.message);
    }
  }
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    navigate("projectDetails", {
      state: { project: project, user: user },
    });
  };

  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <div className="container">
        <header className="jumbotron">
          <h3> Projets List </h3>
        </header>
        <List
          dataSource={projects}
          grid={{ gutter: 20, sm: 1,md: 2,lg: 3}}
          renderItem={project => (
            <List.Item >
              <ProjectContext.Provider value={{ project }}>
              <Card size="small" title={project.name} style={{ width: 300 }} hoverable bordered={false} onClick={() => handleSelectProject(project)}>
                 <Card.Meta description={project.description} style={{ height: '50px', overflow: 'hidden' }} />
                    <Card.Meta description={dayjs(project.deadLine).format('DD/MM/YYYY')} style={{ height: '50px', overflow: 'hidden' }} />
              </Card>
              </ProjectContext.Provider>
            </List.Item>
          )}
        >
        </List>
    </div>
  );
}