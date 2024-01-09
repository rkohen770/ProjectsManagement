import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import dayjs from 'dayjs';
import { Button, Descriptions, List, Card, Tooltip, Popconfirm, message, Tag, Progress, ConfigProvider } from "antd";
import { RollbackOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import TaskService from '../../services/task.service';


export function BoardProject() {
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [tasksTodo, setTasksTodo] = useState([]);
  const [tasksInProgress, setTasksInProgress] = useState([]);
  const [tasksDone, setTasksDone] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const project = location.state.project;
        setProject(project);
        const user = location.state.user;
        setUser(user);

        let projectTasks = [];
        const res = await TaskService.getAllTasks(project.id);
        if (res.status === 200) {
          //projectTasks = user ? res.data.filter(task => task.employeeId == user.id) : res.data;
          projectTasks = res.data;
        }

        const tasksTodo = projectTasks.filter(task => task.status === 'todo');
        const tasksInProgress = projectTasks.filter(task => task.status === 'in-progress');
        const tasksDone = projectTasks.filter(task => task.status === 'done');
        setTasksTodo(tasksTodo);
        setTasksInProgress(tasksInProgress);
        setTasksDone(tasksDone);
      }
      catch (error) {
        message.error('an error has occurred while you were trying to fetch the project data')
        console.log(error);
      }
    }
    fetchData();
  }, [location.state.project, location.state.user]);

  TaskCardList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string,
  };

  function TaskCardList(props) {
    return (
      <List
        header={props.title}
        dataSource={props.data}
        renderItem={item => (
          <List.Item>
            <TaskCard item={item} />
          </List.Item>
        )}>

      </List>
    )
  }

  TaskCard.propTypes = {
    item: PropTypes.object.isRequired,
  };

  function TaskCard(props) {
    const task = props.item;
    return (
      <Card title={task.name} hoverable bordered={false}
        actions={actions(task)} >
        <Descriptions
          items={[
            {
              label: 'Description',
              children: task.description,
            },
            {
              label: 'Deadline',
              children: dayjs(task.deadline).format('DD/MM/YYYY'),
            },
          ]} />
      </Card>
    )
  }

  function actions(task) {
    let actions = [];
    if (task.status === 'todo') {
      actions.push(
        <Tooltip title="start task" color="magenta" key={'start'} >
          <Popconfirm title="Start the task?"
            description="Do you want to start the task now?"
            onConfirm={() => handleStart(task)}
            okText="Yes"
            cancelText="No"
          >
            <ArrowRightOutlined key="arrow" />
          </Popconfirm>
        </Tooltip>,
      )
    }
    else if (task.status === 'in-progress') {
      actions.push(
        <Tooltip title="suspend task" color="magenta" key={'suspend'} >
          <Popconfirm title="Suspend the task?"
            description="Do you want to suspend the task?"
            onConfirm={() => handleSuspend(task)}
            okText="Yes"
            cancelText="No"
          >
            <ArrowLeftOutlined key="delete" />
          </Popconfirm>
        </Tooltip>,
      )
      actions.push(
        <Tooltip title="finish task" color="magenta" key={'finish'} >
          <Popconfirm title="Finish the task?"
            description="Do you want to set the task as done?"
            onConfirm={() => handleFinish(task)}
            okText="Yes"
            cancelText="No"
          >
            <ArrowRightOutlined key="delete" />
          </Popconfirm>
        </Tooltip>,
      )
    }
    else {
      actions.push(
        <Tooltip title="restart task" color="magenta" key={'restart'} >
          <Popconfirm title="Restart the task?"
            description="Do you want to restart the task?"
            onConfirm={() => handleRestart(task)}
            okText="Yes"
            cancelText="No"
          >
            <ArrowLeftOutlined key="delete" />
          </Popconfirm>
        </Tooltip>,
      )
    }
    return actions;
  }

  async function handleStart(task) {
    try {
      task.status = 'in-progress';
      const res = await TaskService.updateTask(task.id, task);
      if (res.status === 200) {
        message.success('the task has been started successfully!')
        setTasksTodo(tasksTodo.filter(t => t.id !== task.id));
        setTasksInProgress([...tasksInProgress, task]);
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to start the task')
    }
  }

  async function handleSuspend(task) {
    try {
      task.status = 'todo';
      const res = await TaskService.updateTask(task.id, task);
      if (res.status === 200) {
        message.success('the task has been suspended successfully!')
        setTasksInProgress(tasksInProgress.filter(t => t.id !== task.id));
        setTasksTodo([...tasksTodo, task]);
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to suspend the task')
    }
  }

  async function handleFinish(task) {
    try {
      task.status = 'done';
      const res = await TaskService.updateTask(task.id, task);
      if (res.status === 200) {
        message.success('the task has been finished successfully!')
        setTasksInProgress(tasksInProgress.filter(t => t.id !== task.id));
        setTasksDone([...tasksDone, task]);
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to finish the task')
    }
  }

  async function handleRestart(task) {
    try {
      task.status = 'in-progress';
      const res = await TaskService.updateTask(task.id, task);
      if (res.status === 200) {
        message.success('the task has been restarted successfully!')
        setTasksDone(tasksDone.filter(t => t.id !== task.id));
        setTasksInProgress([...tasksInProgress, task]);
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.log(error)
      message.error('an error has occurred while you were trying to restart the task')
    }
  }

  return (
    <div className="container">
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h3> {project ? project.name : ""} </h3>
        <Button icon={<RollbackOutlined />} onClick={() => navigate('../projects')} >Go back</Button>
      </header>
      <div className="jumbotron" >
        <h4>Project Description</h4>
        <p>{project ? project.description : ""}</p>
        <div className="footer-jumbotron">
          <div>
            <Descriptions
              items={[{
                label: 'Deadline',
                children: project ? dayjs(project.deadline).format('DD/MM/YYYY') : "",
              }]} />
            {/* TO DO: adding option to present docoment in pdf format */}
            <Button type="link" onClick={() => { }}>View Document</Button>
          </div>
          <ConfigProvider
              theme={{
                components: {
                  Progress: {
                    defaultColor: '#91caff',
                    remainingColor: '#ffccc7',
                  },
                },
              }}
            >
          <Tooltip title= {`${tasksDone.length} done | ${tasksInProgress.length} in progress | ${tasksTodo.length} todo` } color="lime">
              <Progress
                percent={ (tasksDone.length + tasksInProgress.length + tasksTodo.length) === 0 ? 0 :
                  ((tasksDone.length + tasksInProgress.length)/ 
                (tasksDone.length + tasksInProgress.length + tasksTodo.length) * 100).toFixed(2)}
                success={{
                  percent: (tasksDone.length / (tasksDone.length + tasksInProgress.length + tasksTodo.length) * 100),
                  strokeColor: '#b7eb8f',
                }}
              />
          </Tooltip>
          </ConfigProvider>

        </div>
      </div>
      <div className="task-board">
        <Tag color="error"><TaskCardList data={tasksTodo} title="Todo List" /></Tag>
        <Tag color="processing"> <TaskCardList data={tasksInProgress} title="In Progress List" /></Tag>
        <Tag color="success"><TaskCardList data={tasksDone} title="Done List" /></Tag>
      </div>
    </div>
  );
}
