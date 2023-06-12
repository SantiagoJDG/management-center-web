import { getAxiosInstance } from 'utils/axiosClient';

const getDataInformation = (path, callbackMethod) => {
  getAxiosInstance()
    .get(path)
    .then((response) => {
      callbackMethod(response.data);
    })
    .catch((error) => {
      console.error(`Error while getting data from ${path}`, error);
    });
};

export { getDataInformation };
