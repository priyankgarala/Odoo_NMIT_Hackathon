import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 15000, // Increased timeout to 15 seconds
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code within 2xx range
        return response;
    },
    (error) => {
        // Handle different types of errors
        if (error.response) {
            // Server responded with a status code outside of 2xx range
            console.error('Response error:', error.response.data);
            
            // You can handle specific status codes here
            switch (error.response.status) {
                case 400:
                    console.error('Bad Request', error.response.data);
                    break;
                case 401:
                    console.error('Unauthorized access', error.response.data);
                    break;
                case 403:
                    console.error('Forbidden', error.response.data);
                    break;
                case 404:
                    console.error('Resource not found', error.response.data);
                    break;
                case 500:
                    console.error('Server error', error.response.data);
                    break;
                default:
                    console.error(`Error with status code: ${error.response.status}`);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network error - no response received:', error.request);
            console.error('This usually means the server is not running or not accessible');
        } else if (error.code === 'ECONNABORTED') {
            // Timeout error
            console.error('Request timeout - server took too long to respond');
        } else {
            // Error in setting up the request
            console.error('Request configuration error:', error.message);
        }
        
        // Pass the error to the component for handling
        return Promise.reject(error);
    }
);

export default axiosInstance;