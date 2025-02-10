import { useContext } from 'react';
import CollaboratorInformationContext from 'context/collaboratorInformationProvider';

const useCollaboratorInformationKeeper = () => {
  return useContext(CollaboratorInformationContext);
};

export default useCollaboratorInformationKeeper;
