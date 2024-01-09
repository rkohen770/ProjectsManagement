/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import { Home } from "./components/home.component";
import { Profile } from "./components/profile.component";
import { BoardProject } from "./components/common/board-project.component";
import { BoardUser } from "./components/board-user.component";
import { BoardEmployee } from "./components/employee/board-employee.component";
import { EmployeeHome } from "./components/employee/employee-home.component";
import { EmployeeProjects } from "./components/employee/employee-projects.component";
import { BoardAdmin } from "./components/admin/board-admin.component";
import { AdminUsers } from "./components/admin/admin-users.component";
import { AdminHome } from "./components/admin/admin-home.component";
import { Avatar } from "antd";
import { AdminProjects } from "./components/admin/admin-projects.component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showEmployeeBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showEmployeeBoard: user.role === "employee", // "employee
        showAdminBoard: user.role === "admin", // "admin"
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showEmployeeBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div style={{height: '100%'}}>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          < div className="navbar-brand">
            {currentUser ? (
              (currentUser.role === "employee") ? (
                <Link to={"/emp"} className="nav-link">
                  <Avatar size="large" src={currentUser.avatar} style={{ backgroundColor: '#ffffff' }} />
                </Link>
              ) : (
                <Link to={"/admin"} className="nav-link">
                  <Avatar size="large" src={currentUser.avatar} style={{ backgroundColor: '#ffffff' }} />
                </Link>
              )
            ) : (
              <Link to={"/"} className="navbar-brand">
                bezKoder
              </ Link>
            )}
          </div>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                {(currentUser.role === "employee") ? (
                  <Link to={"/employee"} className="nav-link">
                    {currentUser.userName}
                  </Link>
                ) : (
                  <Link to={"/admin"} className="nav-link">
                    {currentUser.userName}
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/employee/*" element={<BoardEmployee />}>
              <Route path="home" element={<EmployeeHome />} />
              <Route path="projects" element={<EmployeeProjects />} />
              <Route path="projects/projectDetails" element={<BoardProject />} />
            </Route>
            <Route path="/admin/*" element={<BoardAdmin />}>
              <Route path="home" element={<AdminHome />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/projectDetails" element={<BoardProject />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;