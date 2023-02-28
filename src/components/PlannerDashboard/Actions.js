import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from './CustomDialog';
import { useState } from 'react';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import CollaboratorFilter from 'components/Collaborators/CollaboratorFilter';

const Actions = ({ measures, userId, getBusinessObjective }) => {
  const [createOpenDialog, setCreateOpenDialog] = useState(false);
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
    createOpenDialog(false);
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

  const getDescriptions = (measuresArray) => {
    const kpisObject = [];
    measuresArray.forEach((measures) => {
      measures.forEach((kpis) => {
        kpisObject.push(kpis);
      });
    });
    return kpisObject;
  };

  const renderMeasuresDialogFields = () => {
    return (
      <>
        <CollaboratorFilter
          title={'Indicadores de Gestion'}
          dropdownData={getDescriptions(measures)}
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
        <CardHeader
          subheader={'Planes de acción'}
          action={
            <IconButton aria-label="settings" onClick={() => setCreateOpenDialog(true)}>
              <AddIcon />
            </IconButton>
          }
        />
        {measures
          ? measures.map((eachMeasurable, index) => {
              return (
                <Card key={index} sx={{ margin: 0.5 }}>
                  <CardContent>
                    <Stack
                      direction="column"
                      spacing={1}
                      divider={<Divider orientation="horizontal" flexItem />}
                    >
                      {eachMeasurable.actions
                        ? eachMeasurable.actions.description.map((actionsDescription, index) => {
                            return (
                              <Typography variant="body1" key={index}>
                                {actionsDescription}
                              </Typography>
                            );
                          })
                        : 'Todavia no hay acciones'}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          : 'Todavia no hay indicadores de accion'}
      </Card>
      <CustomDialog
        open={createOpenDialog}
        title={'Plan de acción'}
        handleClose={() => setCreateOpenDialog(false)}
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
