import { getAxiosInstance } from 'utils/axiosClient';
// import {  useState } from 'react';

const useGet = (path) => {
  const fetchData = async () => {
    try {
      const response = await getAxiosInstance().get(path);
      sessionStorage.setItem('myValue', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return [fetchData];
};

export default useGet;
