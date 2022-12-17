import { useState, useEffect, createContext } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState();
  const [waitingUser, setWaitingUser] = useState(true);

  const getUserData = () => {
    const responsePayload = jwt_decode(userToken);
    return {
      ID: responsePayload.sub,
      name: responsePayload.name,
      picture: responsePayload.picture,
      email: responsePayload.email
    };
  };

  useEffect(() => {
    const authenticatedUser = async () => {
      const token = sessionStorage.getItem('center-token');

      if (!token) {
        setWaitingUser(false);
        return;
      }

      setUserToken(token);

      setWaitingUser(false);
    };

    authenticatedUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        setUserToken,
        getUserData,
        waitingUser,
        setWaitingUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
