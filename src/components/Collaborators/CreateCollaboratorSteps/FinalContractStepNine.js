import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Divider } from '@mui/material';
import useEdit from 'hooks/useEdit';
import useMessage from 'hooks/useMessage';
import 'moment/locale/es';

const FinalContractStepNine = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();

  const [edit] = useEdit(`/api/collaborator/${props.newCollaboratorId}`);

  const { handleSubmit, trigger } = useForm();

  const validateForm = () => {
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const execution = await edit();
        afterExecution(execution);
      })();
    }
  };
  const afterExecution = (execution) => {
    if (execution.status !== 200 || execution.data === 'SequelizeUniqueConstraintError') {
      handleNewMessage({
        text: 'Por favor revisar los campos que deben ser unicos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion de incremento de tarifa fue creada exitosamente',
        severity: 'success'
      });
      props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  useEffect(() => {
    ref.current = validateForm;
  }, []);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={4} p={2}>
          <Grid item>
            <div style={{ textAlign: 'center', color: 'green' }}>
              <p>El proceso se ha completado.</p>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
    </Grid>
  );
});

FinalContractStepNine.displayName = 'FinalContractStepNine';
export default FinalContractStepNine;
