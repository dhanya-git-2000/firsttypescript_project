import axios from 'axios';

const apiClient = axios.create({ 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Or get the token from context/store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  async response => {
    // Check if the response is successful and the URL matches your currency endpoint
    if (response.status === 200 && response.config.url === '/currency') {
      const currencyResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      response.data.currencyRates = currencyResponse.data;
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;

