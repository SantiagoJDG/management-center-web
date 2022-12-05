import { useState, useEffect } from 'react';
import { getAxiosInstance } from '../utils/axiosClient';
const Collaborator = () => {

  const [collaborators, setCollaborators] = useState([]);

  const getCollaborators = async () => {

    try {
      let response = await getAxiosInstance().get('/api/collaborator');
      console.log(response.data)
      setCollaborators(response.data);
    } catch (error) {
      console.error("Error while get Collaborators..", error);
    }

  };

  const showInformation = () => {

    if (collaborators.length < 1) {
      return 'There are not collaborator';
    } else {

      return (
        <>
          {
            collaborators.map((collaborator, idx) => (
              <h2>
                {collaborator.id} - {collaborator.name}
              </h2>
            ))
          }
        </>
      );
    }

  }

  useEffect(() => {

    getCollaborators();

  }, []);

  return (
    <>
      <h1> Collaborator Page!</h1>

      {showInformation()}
    </>
  );
}

export default Collaborator;
