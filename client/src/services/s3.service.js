import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/s3/';

class S3Service {
    uploadFile(data) {
        return axios.post(API_URL + 'upload', data, { headers: authHeader() });
    }
    
    downloadFile(name) {
        return axios.get(API_URL + 'download/' + name, { headers: authHeader() });
    }
    }

export default new S3Service();
