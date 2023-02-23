import { getAxiosInstance } from 'utils/axiosClient';

import useMessage from 'hooks/useMessage';

const useEdit = (path, body) => {
  const { handleNewMessage } = useMessage();

  const edit = async () => {
    try {
      await getAxiosInstance().put(path, body);
    } catch (error) {
      console.error(error);
      handleNewMessage({
        text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
        severity: 'error'
      });
      return error;
    }
  };

  return [edit];
};

export default useEdit;
