import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/tasks/';

class TaskService {
  getAllTasks(projectId) {
    return axios.get(API_URL + projectId, { headers: authHeader() });
  }

  getTaskById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createTask(data) {
    return axios.post(API_URL, data, { headers: authHeader() });
  }

  updateTask(id, data) {
    return axios.put(API_URL + id, data, { headers: authHeader() });
  }

  deleteTask(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new TaskService();