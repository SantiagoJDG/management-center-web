import { useState, useEffect, createContext } from 'react';
import { getAxiosInstance } from '../utils/axiosClient';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState();
  const [waitingUser, setWaitingUser] = useState(true);
  const [userData, setUserData] = useState();

  const getOwnUserData = async (email) => {
    try {
      let response = await getAxiosInstance().get('/api/user', { params: { email: email } });
      return response.data[0];
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  const getUserData = async (credential) => {
    const { sub, name, picture, email } = jwt_decode(credential);
    const ownData = await getOwnUserData(email);
    return {
      ID: sub,
      consultecId: ownData ? ownData.id : '',
      name: ownData ? ownData.name : name,
      picture: picture,
      email: email
    };
  };

  const saveUserSession = async (credential) => {
    const userData = await getUserData(credential);
    setUserData(userData);
    setUserToken(credential);
    setWaitingUser(false);
  };

  const deleteUserSession = () => {
    setUserData(undefined);
    setUserToken(undefined);
  };

  useEffect(() => {
    const authenticatedUser = async () => {
      const token = sessionStorage.getItem('center-token');

      if (!token) {
        setWaitingUser(false);
        return;
      }

      saveUserSession(token);
    };

    authenticatedUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        waitingUser,
        userData,
        saveUserSession,
        deleteUserSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
