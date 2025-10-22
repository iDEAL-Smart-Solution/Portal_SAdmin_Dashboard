import axios from 'axios';

const BASE_URL = 'http://localhost:5093/api/';
// const BASE_URL = 'https://ideal-portal-djhvgncsgdb6fxc5.westus-01.azurewebsites.net/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    const schoolId = sessionStorage.getItem('SchoolId');
    const userStr = sessionStorage.getItem('user');

    // Check if user is Admin before making API calls
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'Admin') {
          // Clear invalid session data
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('SchoolId');
          
          // Redirect to login by throwing an error
          return Promise.reject(new Error('Access denied. Only School Admin accounts can access this dashboard.'));
        }
      } catch {
        // If parsing fails, clear invalid data
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('SchoolId');
        return Promise.reject(new Error('Invalid session data. Please login again.'));
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['SchoolID'] = schoolId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear session data on unauthorized/forbidden responses
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('SchoolId');
      
      // Reload the page to trigger login flow
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

