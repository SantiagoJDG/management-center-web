import { getAxiosInstance } from 'utils/axiosClient';
// import {  useState } from 'react';

const useGet = (path, callbackMethod) => {
  const fetchData = () => {
    getAxiosInstance()
      .get(path)
      .then((response) => {
        sessionStorage.setItem('personal', JSON.stringify(response.data));
        callbackMethod ? callbackMethod(response.data) : '';
      })
      .catch((error) => {
        console.error(`Error while getting data from ${path}`, error);
      });
  };

  return [fetchData];
};

export default useGet;
