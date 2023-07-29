import { createContext, useState } from 'react';

const CollaboratorInformationContext = createContext();

const CollaboratorInformationProvider = ({ children }) => {
  const [formStepInformationData, setFormStepInformationKepper] = useState({
    firstStepForm: {},
    secondStepForm: {},
    thirdStepForm: {},
    fourthStepForm: {},
    fifthStepForm: {},
    sixthStepForm: {},
    seventhStepForm: {},
    eighthStepForm: {}
  });

  const rememberStepFormInformation = (stepName, formInfo) => {
    setFormStepInformationKepper({
      ...formStepInformationData,
      [stepName]: formInfo
    });
  };

  const contextValue = {
    formStepInformationData,
    rememberStepFormInformation
  };

  return (
    <CollaboratorInformationContext.Provider value={contextValue}>
      {children}
    </CollaboratorInformationContext.Provider>
  );
};

export { CollaboratorInformationProvider };

export default CollaboratorInformationContext;
