import { useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

const useDelete = (path, body) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const deletion = async () => {
    try {
      await getAxiosInstance()
        .delete(path, body)
        .then(() => {
          setIsDeleted(true);
        });
    } catch (error) {
      console.log('error');
      setIsDeleted(false);
    }
  };

  return [deletion, isDeleted];
};

export default useDelete;
