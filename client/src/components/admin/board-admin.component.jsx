import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'antd'
import AuthService from '../../services/auth.service';
import {
  HomeOutlined,
  TeamOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import { UserContext } from '../../context/user.context';
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}
export function BoardAdmin() {
  const { user: initialUser } = useContext(UserContext);

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser);

  const navigate = useNavigate();

  const items = [
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Projects', 'projects', <FolderOutlined />),
    getItem('Users', 'users', <TeamOutlined />),
  ];


  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);

  }, []);

  const onSelect = (item) => {
    switch (item.key) {
      case 'home':
        navigate('/admin/home');
        break;
      case 'projects':
        navigate('/admin/projects');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      default:
        break;
    }
  }


  return (
    <div >
      <header >
        <h3>{currentUser.userName} is an Admin User</h3>
      </header>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'start' }}>
        <Menu
          style={{
            width: 256,
          }}
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onSelect={onSelect}
        />
        <Outlet />
      </div>
    </div>
  );
}
