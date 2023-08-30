/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useState } from "react";
import { register } from "../services/profileService";

function Register() {
  return (
    <div>
      <h1>Register</h1>
      <Navbar />
      <form onSubmit={register}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="text" name="password" />
        </label>
        <label>
          Email:
          <input type="text" name="email" />
        </label>
      </form>
    </div>
  );
}

export default Register;