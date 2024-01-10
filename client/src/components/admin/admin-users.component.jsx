import React, { useState, useEffect } from "react";
import { List, Card, message, Avatar, Descriptions, Collapse, Tooltip } from "antd";
import { FolderOpenOutlined, FormOutlined, TagOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import UserService from "../../services/user.service";
import TaskService from "../../services/task.service";
import ProjectService from "../../services/project.service";
import { UserContext } from "../../context/user.context";

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    const response = await UserService.getAllUsersByRole('employee');
    if (response.status === 200) {
      setUsers(response.data);
    }
    else {
      console.log(response.message);
      message.error(response.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  EmpCard.propTypes = {
    item: PropTypes.object.isRequired,
  };

  function EmpCard(props) {
    const { item } = props;
    const [employeeTasks, setEmployeeTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [todoTasks, setTodoTasks] = useState(0);
    const [inProgressTasks, setInProgressTasks] = useState(0);
    const [doneTasks, setDoneTasks] = useState(0);

    useEffect(() => {
      async function fetchEmpTasks() {
        const response = await TaskService.getAllTasks();
        const projects = await ProjectService.getAllProjects();
        if (response.status === 200 && projects.status === 200) {
          setEmployeeTasks(response.data.filter(task => task.employeeId === item.id));
          setTotalTasks(employeeTasks.length);
          setTotalProjects(employeeTasks.reduce((acc, task) => { return acc.includes(task.projectId) ? acc : [...acc, task.projectId] }, []).length);
          setTodoTasks(employeeTasks.filter(task => task.status === 'todo').length);
          setInProgressTasks(employeeTasks.filter(task => task.status === 'in-progress').length);
          setDoneTasks(employeeTasks.filter(task => task.status === 'done').length);
        } else {
          console.log(response.message);
          message.error(response.message);
        }
      }
      fetchEmpTasks();
    }
      , []);

    const getChildren = () => {

      return (
        <div>
          <Descriptions
            labelStyle={{color:'orange'}}
            column={1}
            size="small"
            items={[
              {
                label: <p><FolderOpenOutlined />    Total Projects</p>,
                children: totalProjects,
              },
              {
                label: <p><FormOutlined />   Total Tasks</p>,
                children: totalTasks,
              },
              {
                label: <p><TagOutlined />   To Do</p>,
                children: todoTasks,
              },
              {
                label: <p><TagOutlined />   In Progress</p>,
                children: inProgressTasks,
              },
              {
                label: <p><TagOutlined />   Done</p>,
                children: doneTasks,
              },
            ]} />
        </div>
      )
    }
    return (
      <UserContext.Provider value={{ user: item }}>
        <Collapse
          items={[{
            key: `${item.id}`,
            label: <div><Avatar src={item.avatar} alt="avatar" />{item.userName}</div>,
            children: getChildren()
          }]} />
      </UserContext.Provider >
    );
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admin Users</h3>
      </header>
      <List
        dataSource={users}
        grid={{ gutter: 20, sm: 2, md: 3, lg: 4 }}
        renderItem={item => (
          <List.Item>
            <EmpCard item={item} />
          </List.Item>
        )} >
      </List>
    </div>
  );
}