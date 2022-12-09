import axios from 'axios';

const baseUrl =
  process.env.PUBLIC_MANAGEMENT_CENTER_API_ENDPOINT ?? 'http://localhost:3001';

const axiosClient = axios.create({
  baseURL: baseUrl,
});

function getAxiosInstance() {
  const token = sessionStorage.getItem('center-token');
  const instance = axios.create();

  instance.defaults.baseURL = baseUrl;

  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  instance.defaults.headers.common.Accept = 'application/json';
  instance.defaults.headers.post['Content-Type'] = 'application/json';

  return instance;
}

export { getAxiosInstance };

export default axiosClient;
