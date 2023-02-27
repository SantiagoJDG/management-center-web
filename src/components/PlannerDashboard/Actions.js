import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useOnOffSwitch from 'hooks/useOnOffSwitch';
import CustomDialog from './CustomDialog';
import { useState } from 'react';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import CollaboratorFilter from 'components/Collaborators/CollaboratorFilter';

const Actions = ({ measures, userId, getBusinessObjective }) => {
  const [createOpenDialog, setCreateOpenDialog] = useOnOffSwitch(false);
  const { handleNewMessage } = useMessage();

  const [newAction, setNewAction] = useState({
    description: '',
    measuresIds: [],
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
    setNewAction({ ...newAction, description: '', category: null, id: null });
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
    const measuresObj = [];
    measuresArray.forEach((Kpis) => {
      Kpis.forEach((eachKpis) => {
        measuresObj.push(eachKpis);
      });
    });
    return measuresObj;
  };

  const renderMeasuresDialogFields = () => {
    return (
      <CollaboratorFilter
        title={'Indiadores de Gestion'}
        dropdownData={getDescriptions(measures)}
        filterData={executeFilter}
      />
    );
  };

  const renderStrategy = (strategy) => {
    return <Typography> Estrategia: {strategy} </Typography>;
  };

  return (
    <>
      <Card>
        <CardHeader
          subheader={'Planes de acción'}
          action={
            <IconButton aria-label="settings" onClick={setCreateOpenDialog}>
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
                        : ' NO'}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          : '  nO'}
      </Card>
      <CustomDialog
        open={createOpenDialog}
        title={'Plan de acción'}
        handleClose={setCreateOpenDialog}
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
