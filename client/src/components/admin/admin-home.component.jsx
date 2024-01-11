import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

import TaskService from '../../services/task.service';
import ProjectService from "../../services/project.service";


export function AdminHome() {

  // const [loading, setLoading] = useState(false);

 
  // useEffect(() => {
  //   useLoaderData();
  // }, [])

  const [totalProjects, setTotalProjects] = useState([]);
  const [totaltasks, setTotalTasks] = useState([]);
  const [projectsInProgress, setProjectsInProgress] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);



  useEffect(() => {
    // Fetch all projects and update the totalProjects state
    ProjectService.getAllProjects()
      .then((response) => {
        const projects = response.data;
        setTotalProjects(projects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });

  

    TaskService.getAllTasks()
      .then((response) => {
        const tasks = response.data;
        setTotalTasks(tasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks in progress:', error);
      });

      const tasksInProcess = totaltasks.filter((item)=> {item.status==='in-progress' || item.status==='todo'}); 
       setProjectsInProgress (totalProjects.filter((item) => tasksInProcess.find((task)=>task.projectId ===item.id)).length);
      
  }, []);



  const dataSource = [
    {
      key: '1',
      avg: 'num of tasks',
      num:'',
      
    },
    {
      key: '2',
      avg: 'done tasks',
      num: '',
    },
    {
      key: '3',
      avg: 'in process tasks',
      num: '',
    },
    {
      key: '4',
      avg: 'todo tasks',
      num: '',
    },
  ];
  
  const columns = [
    {
      title: 'Average of',
      dataIndex: 'avg',
      key: 'avg',
    },
    {
      title: 'Num',
      dataIndex: 'num',
      key: 'num',
    },
   
  ];
  
  
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admin Home</h3>
      </header>  
      <div>
        <h>total projects: </h>
        <p>{totalProjects.length}</p>

        <br /><h>projects in process: </h>
        <p>{projectsInProgress}</p>

        <br /><h> projects completed: </h>
        <p>{totalProjects.length-projectsInProgress}</p>

      </div>
      <br /><Table dataSource={dataSource} columns={columns} />

    </div>
  );
}
