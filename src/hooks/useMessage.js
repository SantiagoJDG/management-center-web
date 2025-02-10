import Messagecontext from 'context/MessageProvider';
import { useContext } from 'react';

const useMessage = () => {
  return useContext(Messagecontext);
};

export default useMessage;
