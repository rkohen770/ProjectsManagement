/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useState } from "react";
import { login } from "../services/profileService";

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Navbar/>
      <form onSubmit={login}>
        <label>
            Username:
            <input type="text" name="username" />
        </label>
        <label>
            Password:
            <input type="text" name="password" />
        </label>
      </form>
    </div>
  );
}

export default Login;