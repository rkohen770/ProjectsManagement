import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Card, Modal, Button, message, Tooltip, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';


import { ProjectForm } from "./project-form.component";
import { TaskForm } from "./task-form.component";
import ProjectService from "../../services/project.service";
import { ProjectContext } from "../../context/project.contex";

export function AdminProjects() {
  const [addProjectDialogIsOpen, setAddProjectDialogIsOpen] = useState(false);
  const [updateProjectDialogIsOpen, setUpdateProjectDialogIsOpen] = useState(false);
  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false);
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      const response = await ProjectService.deleteProject(id);
      if (response.status === 200) {
        message.success('the project has been deleted successfully!')
        fetchData();
      } else {
        message.error(response.message)
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to delete the project')
    }
  }

  const handleAddTask = (project) => {
    setSelectedProject(project);
    setAddTaskDialogIsOpen(true);
  }

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setUpdateProjectDialogIsOpen(true);
  }

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    navigate("projectDetails", { state: { project: project } });
  }
  useEffect(() => {
    fetchData();
  }, [])

  const cancel = () => {
    message.error('the project has not been deleted')
  }

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
                <Card  title={project.name} size="small" hoverable bordered={false} onClick={() => handleSelectProject(project)}
                style={{ width: 300 }}
                  actions={[
                    <Tooltip title="Delete project" color="magenta" key={'delete'} >
                      <Popconfirm title="Delete the project?"
                        description="Are you sure to delete this project?"
                        onConfirm={(e) => { e.stopPropagation(); handleDelete(project.id) }}
                        onCancel={(e) => { e.stopPropagation(); cancel}}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined key="delete"  onClick={(e) => e.stopPropagation()} />
                      </Popconfirm>
                    </Tooltip>,
                    <Tooltip title="Add task" color="blue" key={'add'}>
                      <PlusOutlined key="add" onClick={(e) => { e.stopPropagation(); handleAddTask(project) }} />
                    </Tooltip>,
                    <Tooltip title="Edit project" color="green" key={'edit'}>
                      <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); handleEditProject(project) }} />
                    </Tooltip>
                  ]} >
                    <Card.Meta description={project.description} style={{ height: '50px', overflow: 'hidden' }} />
                    <Card.Meta description={dayjs(project.deadLine).format('DD/MM/YYYY')} style={{ height: '50px', overflow: 'hidden' }} />
                </Card>
              </ProjectContext.Provider>
            </List.Item>
          )}
        >
        </List>
        <Modal
          title="Add project"
          footer={null}
          closable={true}
          destroyOnClose={true}
          open={addProjectDialogIsOpen}
          width={550}
          onCancel={() => setAddProjectDialogIsOpen(false)}
        >
          <ProjectForm
            onSubmitSuccess={() => {
              fetchData()
              setAddProjectDialogIsOpen(false)
            }}
          />
        </Modal>
        <Modal
          title="Update project"
          footer={null}
          closable={true}
          open={updateProjectDialogIsOpen}
          destroyOnClose={true}
          width={550}
          onCancel={() => setUpdateProjectDialogIsOpen(false)}
        >
          <ProjectForm
            project={selectedProject}
            onSubmitSuccess={() => {
              fetchData()
              setUpdateProjectDialogIsOpen(false)
            }}
          />
        </Modal>
        <Modal
          title="Add Task"
          footer={null}
          closable={true}
          open={addTaskDialogIsOpen}
          destroyOnClose={true}
          width={600}
          onCancel={() => setAddTaskDialogIsOpen(false)}
        >
          <TaskForm
            project={selectedProject}
            onSubmitSuccess={() => {
              fetchData()
              setAddTaskDialogIsOpen(false)
            }}
          />
        </Modal>
        <footer style={{ justifyContent: 'end' }}>
          <Button onClick={() => setAddProjectDialogIsOpen(true)}>Add project</Button>
        </footer>
    </div >
  );
}