import { useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

import useMessage from 'hooks/useMessage';

const useDelete = (path) => {
  const { handleNewMessage } = useMessage();

  const deletion = async () => {
    try {
      await getAxiosInstance().delete(path);
    } catch (error) {
      console.error('error');
      handleNewMessage({
        text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
        severity: 'error'
      });
    }
  };

  return [deletion];
};

export default useDelete;
