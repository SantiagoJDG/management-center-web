import { useContext} from 'react';
import  Messagecontext from 'context/MessageProvider';

const useMessage = () => {
    return useContext(Messagecontext);
};

export default useMessage;
