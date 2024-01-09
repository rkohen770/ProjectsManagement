import axios from "axios";

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

  uploadImage(image) {
    return axios.post(API_URL + "images", image);
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(userName, email, password, role, firstName, lastName, avatar) {
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

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();