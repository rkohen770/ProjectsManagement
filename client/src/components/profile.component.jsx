/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, createContext } from "react";
import { Navigate } from "react-router-dom";
import { Card, List } from "antd";
import AuthService from "../services/auth.service";
import { UserContext } from "../context/user.context";
export function Profile() {

  const { user: initialUser } = useContext(UserContext);

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser);


  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);

  }, []);

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="container">
        {userReady ?
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
            </header>
          </div> : null}
      </div>
    </UserContext.Provider>
  );
}