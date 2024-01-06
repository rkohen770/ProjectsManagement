import { List, Card, Modal, Button } from "antd";
import React, { useContext, useState } from "react";
import { UserContext } from "../../context/user.context";

import { ProjectForm } from "./add-project-form.component";

export function AdminProjects() {
  const { user, setUser } = useContext(UserContext);

  const [projectDialogIsOpen, setProjectDialogIsOpen] = useState(false);

  const fetchData = async () => {
  } 

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admin Projects</h3>
      </header>
      <List
        dataSource={user.projects}
        grid={{ gutter: 200, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }}
        renderItem={project => (
          <List.Item>
            <Card title={project.title} bordered={false}>
              <p>{project.name}</p>
            </Card>
          </List.Item>
        )}
      >
      </List>
      <Modal
        title= "Add project"
        footer={null}
        closable={true}
        open={projectDialogIsOpen}
        width={550}
        onCancel={() => setProjectDialogIsOpen(false)}
      >
        <ProjectForm
          onSubmitSuccess={() => {
            fetchData()
            setProjectDialogIsOpen(false)
          }}
        />
      </Modal>
      <footer style={{ justifyContent: 'end' }}>
        <Button onClick={() => setProjectDialogIsOpen(true)}>Add project</Button>
      </footer>
    </div>
  );
}