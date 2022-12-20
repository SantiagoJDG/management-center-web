import { useState, useEffect } from 'react';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

const Collaborator = () => {
  const { userToken, getUserData, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState([]);

  const getCollaborators = async () => {
    try {
      let response = await getAxiosInstance().get('/api/collaborator');
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  const logout = () => {
    /*global google */
    google.accounts.id.revoke(getUserData().ID, () => {
      sessionStorage.clear();
    });
  };

  const showInformation = () => {
    if (collaborators.length < 1) {
      return 'There are not collaborator';
    } else {
      return (
        <>
          {collaborators.map((collaborator, idx) => (
            <h2 key={idx}>
              {collaborator.id} - {collaborator.name}
            </h2>
          ))}

          <button onClick={logout}>SALIR</button>
        </>
      );
    }
  };

  useEffect(() => {
    if (!userToken) return;

    getCollaborators();
  }, [waitingUser, userToken]);

  return (
    <>
      <h1> Collaborator Page!</h1>

      {showInformation()}
    </>
  );
};

export default Collaborator;
