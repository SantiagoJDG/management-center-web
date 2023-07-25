import { useRef, forwardRef, useEffect } from 'react';
import useGet from 'hooks/useGet';

import useCollaboratorInformationKeeper from 'hooks/useCollaboratorInformationKeeper';

const StepContainer = forwardRef(
  (
    {
      ComponentStep: ComponentStep,
      setActiveStep: setActiveStep,
      setFormCompleted: setFormCompleted,
      stepName: stepName,
      setNewCollaboratorId: setNewCollaboratorId,
      newCollaboratorId: newCollaboratorId
    },
    ref
  ) => {
    const assingRef = useRef(null);
    const { formStepInformationData, rememberStepFormInformation } =
      useCollaboratorInformationKeeper();

    const [fetchData] = useGet(`/api/collaborator/${newCollaboratorId}`);

    const handlerStepperValidation = (execution, newCollaboratorInfo) => {
      const idNewCollaborator = execution.data;
      setNewCollaboratorId(idNewCollaborator);
      sessionStorage.setItem('collaboratorId', idNewCollaborator);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFormCompleted(false);
      rememberStepFormInformation(stepName, newCollaboratorInfo);
    };

    const executeRef = () => assingRef.current();

    useEffect(() => {
      if (newCollaboratorId) {
        const storedInfo = JSON.parse(sessionStorage.getItem('personal'));
        if (!storedInfo) {
          fetchData();
        } else {
          rememberStepFormInformation(stepName, storedInfo);
        }
      }
      ref.current = executeRef;
    }, [newCollaboratorId]);

    return (
      <ComponentStep
        ref={assingRef}
        formData={formStepInformationData[stepName]}
        callBackValidations={handlerStepperValidation}
        setFormCompleted={setFormCompleted}
        newCollaboratorId={newCollaboratorId}
      />
    );
  }
);
StepContainer.displayName = 'StepContainer';
export default StepContainer;
