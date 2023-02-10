import { createContext, useState } from 'react';

const Messagecontext = createContext();

const MessageProvider = ({ children }) => {
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'error' });

  const handleNewMessage = (newMessage) => {
    setMessage(newMessage);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  return (
    <Messagecontext.Provider
      value={{
        openMessage,
        message,
        handleNewMessage,
        handleCloseMessage
      }}
    >
      {children}
    </Messagecontext.Provider>
  );
};

export { MessageProvider };

export default Messagecontext;
