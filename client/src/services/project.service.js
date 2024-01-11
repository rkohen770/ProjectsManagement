import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/projects/';

class ProjectService {
  getAllProjects() {
    return axios.get(API_URL, { headers: authHeader() });
  }

 

  //get all projects by user id
  getAllProjectsByUserId(id) {
    return axios.get(API_URL + "user/" + id, { headers: authHeader() });
  }

  getProjectById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createProject(data) {
    return axios.post(API_URL, data, { headers: authHeader() });
  }

  updateProject(id, data) {
    return axios.put(API_URL + id, data, { headers: authHeader() });
  }

  deleteProject(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new ProjectService();