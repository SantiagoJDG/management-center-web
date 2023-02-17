import { useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

const useEdit = (path, body) => {
  const [isEdited, setIsEdited] = useState(false);
  const edit = async () => {
    try {
      await getAxiosInstance()
        .put(path, body)
        .then(() => {
          setIsEdited(true);
        });
    } catch (error) {
      console.log('error');
      setIsEdited(false);
    }
  };

  return [edit, isEdited];
};

export default useEdit;
