import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/users/';
const API_URL_TEST = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL_TEST + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL_TEST + 'user', { headers: authHeader() });
  }

  getEmployeeBoard() {
    return axios.get(API_URL_TEST + 'emp', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL_TEST + 'admin', { headers: authHeader() });
  }

  getAllUsers() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getUserById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createUser(data) {
    return axios.post(API_URL, data, { headers: authHeader() });
  }

  updateUser(id, data) {
    return axios.put(API_URL + id, data, { headers: authHeader() });
  }

  deleteUser(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new UserService();