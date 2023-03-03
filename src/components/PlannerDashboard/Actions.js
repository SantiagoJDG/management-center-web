import { Card, CardContent, Stack, Typography, Divider, TextField, Chip, Box } from '@mui/material';
import CustomDialog from './CustomDialog';
import { useState } from 'react';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import CustomFilterDropdown from 'components/CustomFilterDropdown';

const Actions = ({ actions, userId, getBusinessObjective, strategy, openDialog, dialogState }) => {
  const { kpisData } = strategy;
  const { handleNewMessage } = useMessage();
  const [newAction, setNewAction] = useState({
    description: '',
    measuresIds: undefined,
    time: '',
    author: userId
  });
  const [create] = useCreate('/api/business-plan/action', newAction);

  const createAction = async () => {
    if (newAction.description == '' || newAction.measuresIds < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una métrica valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await create();
    if (error) return;
    await getBusinessObjective();
    openDialog(false);
    setNewAction({ ...newAction, description: '', measuresIds: null, time: null });
  };

  const executeFilter = (value) => {
    setNewAction((previousState) => {
      if (!Object.keys(previousState).length) return value;
      return {
        ...previousState,
        measuresIds: [value]
      };
    });
  };

  const renderMeasuresDialogFields = () => {
    return (
      <>
        <Box sx={{ display: 'flex' }} gap={0.5}>
          <Chip color="primary" label={'Estrategia: '} />
          <Typography>{strategy.description}</Typography>
        </Box>
        <CustomFilterDropdown
          title={'Indicadores de Gestion'}
          dropdownData={kpisData}
          filterData={executeFilter}
        />
        {renderTimeTextField()}
      </>
    );
  };

  const renderTimeTextField = () => {
    return (
      <TextField
        margin="dense"
        label="Tiempo máximo de ejecución"
        type="text"
        fullWidth
        size="small"
        variant="outlined"
        value={newAction.time}
        onChange={handleDescription}
      />
    );
  };

  const handleDescription = (event) => {
    setNewAction({ ...newAction, time: event.target.value });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction="column"
            spacing={1}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            {Object.keys(actions).length > 0
              ? actions.map((eachMeasurable, index) => {
                  return (
                    <Typography variant="body1" key={index}>
                      {eachMeasurable.description}
                    </Typography>
                  );
                })
              : 'Todavia no hay planes de accion'}
          </Stack>
        </CardContent>
      </Card>
      <CustomDialog
        open={dialogState}
        title={'Plan de acción'}
        handleClose={() => openDialog(false)}
        requestMethod={createAction}
        displayDropdown={renderMeasuresDialogFields()}
        newObject={newAction}
        setNewObject={setNewAction}
        nameMethod={'create'}
      />
    </>
  );
};

export default Actions;
