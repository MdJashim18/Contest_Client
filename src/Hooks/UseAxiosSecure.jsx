import axios from 'axios';

const UseAxiosSecure = () => {
  const instance = axios.create({
    baseURL: 'https://contest-server-ten.vercel.app'
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export default UseAxiosSecure;
