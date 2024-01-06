import React, { useContext, useEffect, useState } from "react";
import { List, Card } from 'antd'
import UserService from '../services/user.service'; // Assuming UserService is imported from here
import AuthService from '../services/auth.service';
import { UserContext } from '../context/user.context';

export function BoardEmployee() {
  const { user: initialUser } = useContext(UserContext);

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);

  }, []);



  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{currentUser.username} is an Employee User</h3>
      </header>
      <List
        dataSource={currentUser.projects}
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
    </div>
  );
}