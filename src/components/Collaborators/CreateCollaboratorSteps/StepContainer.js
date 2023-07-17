import { useRef, forwardRef, useEffect } from 'react';
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

    const handlerStepperValidation = (execution, newCollaboratorInfo) => {
      const idNewCollaborator = execution.data;
      setNewCollaboratorId(idNewCollaborator);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFormCompleted(false);
      rememberStepFormInformation(stepName, newCollaboratorInfo);
    };

    const executeRef = () => assingRef.current();

    useEffect(() => {
      ref.current = executeRef;
    }, []);

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
