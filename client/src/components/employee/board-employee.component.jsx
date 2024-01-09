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
export function BoardEmployee() {
  const { user } = useContext(UserContext);

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const navigate = useNavigate();

  const items = [
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Projects', 'projects', <FolderOutlined />),
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
        navigate('/employee/home');
        break;
      case 'projects':
        navigate('/employee/projects');
        break;
      default:
        break;
    }
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="container">
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
    </UserContext.Provider>
  );
}

