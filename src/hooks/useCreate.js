import { useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

const useCreate = (path, body) => {
  const [isSaved, setIsSaved] = useState(false);
  const create = async () => {
    try {
      await getAxiosInstance()
        .post(path, body)
        .then(() => {
          setIsSaved(true);
        });
    } catch (error) {
      console.log('error');
      setIsSaved(false);
    }
  };

  return [create, isSaved];
};

export default useCreate;
