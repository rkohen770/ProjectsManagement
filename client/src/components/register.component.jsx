import { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkboxRole, setCheckboxRole] = useState("employee");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const form = useRef();
  const checkBtn = useRef();

  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
  }

  const onChangeLastName = (e) => {
    setLastName(e.target.value);
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const onChangeCheckboxRole = (e) => {
    setCheckboxRole(e.target.value);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(
        `${firstName} ${lastName}`,
        email,
        password,
        checkboxRole,
        firstName,
        lastName,
      ).then(
        response => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setSuccessful(false);
          setMessage(resMessage);
        }
      );
    }
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form
          onSubmit={handleRegister}
          ref={form}
        >
          {!successful && (
            <div>
              <div className="form-group">
              <label htmlFor="checkboxRole">Role</label>
              <select className="form-control" id="checkboxRole" name="checkboxRole" value={checkboxRole} onChange={onChangeCheckboxRole}>
                <option value="user">employee</option>
                <option value="admin">admin</option>
              </select>
              </div>
              <div className="form-group">
                <label htmlFor="firstName">FirstName</label>
                <Input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={firstName}
                  onChange={onChangeFirstName}
                  validations={[required]}
                />                  
              </div>
              <div className="form-group">
                <label htmlFor="lastName">LastName</label>
                <Input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={lastName}
                  onChange={onChangeLastName}
                  validations={[required]}
                />                  
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={
                  successful
                    ? "alert alert-success"
                    : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton
            style={{ display: "none" }}
            ref={checkBtn}
          />
        </Form>
      </div>
    </div>
  );
}

export default Register;