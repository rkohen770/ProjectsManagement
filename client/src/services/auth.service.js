import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
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

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password, role, firstName, lastName) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      role,
      firstName,
      lastName
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();