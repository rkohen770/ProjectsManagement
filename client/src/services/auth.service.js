import axios from "axios";

import s3Service from "./s3.service";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(userName, password) {
    return axios
      .post(API_URL + "signin", {
        userName,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          const user = {
            ...response.data,
            projects: []
          }
          localStorage.setItem("user", JSON.stringify(user));
        }

        return response.data;
      });
  }

  // uploadImage(image) {
  //   //return axios.post(API_URL + "images", image);
  //   return s3Service.uploadFile(image);
  // }

  logout() {
    localStorage.removeItem("user");
  }

  register(userName, email, password, role, firstName, lastName, avatar) {
    //s3Service.uploadFile(avatar);
    return axios.post(API_URL + "signup", {
      userName,
      email,
      password,
      role,
      firstName,
      lastName,
      avatar
    });
  }

  updateUser(id, data) {
    return axios.post(API_URL + "update/" + id, data);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();