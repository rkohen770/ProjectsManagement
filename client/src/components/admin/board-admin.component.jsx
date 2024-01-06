import React, { useState, useEffect, useContext } from 'react';
import { List, Card, Radio, Space, Tabs } from 'antd'
import AuthService from '../../services/auth.service';
import { AdminHome } from './admin-home.component';
import { AdminProjects } from './admin-projects.component';
import { AdminUsers } from './admin-users.component';
import {
  HomeOutlined,
  TeamOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import UserService from '../../services/user.service'; // Assuming UserService is imported from here
import { UserContext } from '../../context/user.context';
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    label,
    children,
  }
}
export function BoardAdmin() {
  const { user: initialUser } = useContext(UserContext);

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser);

  const items = [
    getItem('Home', 'home', <HomeOutlined />, <AdminHome />),
    getItem('Projects', 'projects', <FolderOutlined />, <AdminProjects />),
    getItem('Users', 'users', <TeamOutlined />, <AdminUsers />),
  ];


  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);

  }, []);


  return (
    <div className="container">
      <header >
        <h3>{currentUser.username} is an Admin User</h3>
      </header>
      <Tabs tabPosition='left' items={items} />
    </div>
  );
}
