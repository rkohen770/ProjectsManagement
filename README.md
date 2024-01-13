# Project Management System

## Overview

This is a project management system with two types of users with different permissions - managers and employees.


[![S097H.gif](https://s13.gifyu.com/images/S097H.gif)](https://gifyu.com/image/S097H)


Employees can:

- View all existing projects 
- Click on a project to view details (PDF) and assigned tasks
- View and update progress on tasks assigned to them

Managers can: 

- View all employee users
- See statistics on employee progress
- View, edit, add, and delete projects
- Click on projects to view details (PDF) and assigned tasks
- Assign tasks to employees
- Update and delete tasks

Both user types can:

- Update their user profile and upload a profile picture

## Technologies

- User authentication and authorization with JWT
- Database split into two parts, each hosted remotely:
    - SQL database (PlanetScale) storing users, projects, and tasks
    - Key-value database (Amazon S3) storing files like profile pictures, project details PDFs, etc.
