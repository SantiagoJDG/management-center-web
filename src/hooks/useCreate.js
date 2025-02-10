import { getAxiosInstance } from 'utils/axiosClient';

import useMessage from 'hooks/useMessage';

const useCreate = (path, body, options) => {
  const { handleNewMessage } = useMessage();

  const create = async () => {
    try {
      const response = await getAxiosInstance().post(path, body, options);
      return response;
    } catch (error) {
      console.error(error);
      handleNewMessage({
        text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
        severity: 'error'
      });
      return error;
    }
  };

  return [create];
};

export default useCreate;
