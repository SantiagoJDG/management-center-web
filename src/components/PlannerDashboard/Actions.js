import {
  CardHeader,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  Grid,
  IconButton,
  Box
} from '@mui/material';
import { useState } from 'react';
import CustomDialog from './CustomDialog';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import CustomFilterDropdown from 'components/CustomFilterDropdown';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';
import useAuth from 'hooks/useAuth';
import useDelete from 'hooks/useDelete';
import useEdit from 'hooks/useEdit';

const Actions = ({
  kpiParent,
  userId,
  getBusinessObjective,
  strategy,
  setOpenActionsDialog,
  openActionsDialog
}) => {
  const { kpisData } = strategy;
  const { handleNewMessage } = useMessage();
  const [newAction, setNewAction] = useState({
    description: '',
    kpis: undefined,
    time: '',
    author: userId
  });
  const { userData } = useAuth();
  const [create] = useCreate('/api/business-plan/action-plan', newAction);
  const [deletion] = useDelete(`/api/business-plan/action-plan/${newAction.id}`);
  const [edit] = useEdit(`/api/business-plan/action-plan/${newAction.id}`, newAction);
  const [itemKpiData, setItemKpiData] = useState([]);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToEdited, setCategoryToEdited] = useState();

  const createAction = async () => {
    if (newAction.description == '' || newAction.kpis < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una acción valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await create();
    if (error) return;
    await getBusinessObjective();
    setOpenActionsDialog(false);
    setNewAction({ ...newAction, description: '', kpis: null, time: null });
  };

  const executeFilter = (value) => {
    const kpiIds = value.map((eachId) => {
      return { id: eachId };
    });
    setNewAction((previousState) => {
      if (!Object.keys(previousState).length) return value;
      return {
        ...previousState,
        kpis: kpiIds
      };
    });
  };

  const renderActionDialogFields = () => {
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
          kpiData={itemKpiData}
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
        defaultValue={categoryToEdited}
        onChange={handleDescription}
      />
    );
  };

  const handleDescription = (event) => {
    setNewAction({ ...newAction, time: event.target.value });
  };

  const deleteAction = async () => {
    const error = await deletion();
    if (error) return;
    await getBusinessObjective();
    setOpenDeleteDialog(false);
    setNewAction({ ...newAction, description: '', kpis: null, time: null });
  };

  const handleClickOpenDeleteDialog = (measures) => {
    setNewAction({
      id: measures.id,
      description: measures.description
    });
    setOpenDeleteDialog(true);
  };

  function hanldeCloseDialog(methodToClose) {
    setNewAction({ ...newAction, description: '', kpis: null, time: null });
    setCategoryToEdited();
    methodToClose(false);
  }

  const handleClickOpenEditDialog = (actionPlans) => {
    const kpi = kpisData.filter((kpi) => kpi.id == kpiParent.id);
    const kpiId = kpi.map((kpi) => {
      return kpi.id;
    });
    setItemKpiData(kpi);

    setCategoryToEdited(strategy.description);
    setNewAction({
      id: actionPlans.id,
      description: actionPlans.description,
      time: actionPlans.time,
      author: userId,
      kpis: [kpiId]
    });

    setOpenEditDialog(true);
  };

  const editAction = async () => {
    if (setNewAction.description == '' || setNewAction.category < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una meta valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await edit();
    if (error) return;
    await getBusinessObjective();
    setOpenEditDialog(false);
    setNewAction({ ...newAction, description: '', kpis: null, time: null });
  };

  const editableAction = (actions) => {
    if (actions.authorData.id === userData.id) {
      return (
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item>
            <IconButton onClick={() => handleClickOpenDeleteDialog(actions)}>
              <DeleteIcon style={{ color: '#03a9f4' }} />
            </IconButton>
          </Grid>
          <Grid item justifySelf="end">
            <IconButton aria-label="edit" onClick={() => handleClickOpenEditDialog(actions)}>
              <BorderColorSharpIcon style={{ color: '#03a9f4' }} />
            </IconButton>
          </Grid>
        </Grid>
      );
    } else {
      return;
    }
  };

  return (
    <>
      <Grid container>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            {Object.keys(kpiParent.actionData).length > 0
              ? kpiParent.actionData.map((eachMeasurable, index) => {
                  return (
                    <Card key={index} sx={{ margin: 0.5 }}>
                      {eachMeasurable.authorData ? (
                        <CardHeader
                          action={editableAction(eachMeasurable)}
                          subheader={
                            <Typography
                              sx={{ fontWeight: 'bold' }}
                              color={'#03a9f4'}
                              variant="body1"
                              key={index}
                            >
                              {eachMeasurable.description}
                            </Typography>
                          }
                        />
                      ) : (
                        ''
                      )}
                    </Card>
                  );
                })
              : 'Actualmente no hay plan de acción'}
          </CardContent>
        </Card>
      </Grid>

      <CustomDialog
        open={openActionsDialog}
        title={'Plan de acción'}
        handleClose={() => setOpenActionsDialog(false)}
        requestMethod={createAction}
        displayDropdown={renderActionDialogFields()}
        newObject={newAction}
        setNewObject={setNewAction}
        nameMethod={'create'}
      />

      <CustomDialog
        nameMethod={'delete'}
        title={'Eliminación de Plan de Acción'}
        open={openDeleteDialog}
        handleClose={() => hanldeCloseDialog(setOpenDeleteDialog)}
        requestMethod={deleteAction}
        newObject={newAction}
      />

      <CustomDialog
        nameMethod={'edit'}
        title={'Edición de Plan de Acción seleccionada'}
        open={openEditDialog}
        handleClose={() => hanldeCloseDialog(setOpenEditDialog)}
        displayDropdown={renderActionDialogFields()}
        requestMethod={editAction}
        newObject={newAction}
        setNewObject={setNewAction}
      />
    </>
  );
};

export default Actions;
