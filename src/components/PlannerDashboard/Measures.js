import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton,
  Autocomplete,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Actions from './Actions';
import CustomDialog from './CustomDialog';
import useOnOffSwitch from 'hooks/useOnOffSwitch';
import useCreate from 'hooks/useCreate';
import CustomCardHeader from './CustomCardHeader';
import useMessage from 'hooks/useMessage';

const Measures = ({ measures, strategies, userId, getBusinessObjective }) => {
  const [openDialog, setOpenDialog] = useOnOffSwitch(false);
  const [newMeasure, setNewMeasure] = useState({
    description: '',
    businessStrategy: null,
    author: userId
  });
  const [create] = useCreate('/api/business-plan/kpi', newMeasure);
  const { handleNewMessage } = useMessage();

  async function handleCategory(event, value) {
    const strategyId = strategies.find((goal) => goal.description === value);
    setNewMeasure({ ...newMeasure, businessStrategy: strategyId.id });
  }

  const createMeasure = async () => {
    if (newMeasure.description == '' || newMeasure.businessStrategy < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una métrica valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await create();
    if (error) return;
    await getBusinessObjective();
    setOpenDialog(false);
    setNewMeasure({ ...newMeasure, description: '', category: null, id: null });
  };

  const renderStrategiesDropdown = () => {
    return (
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={strategies.map((strategy) => strategy.description)}
        onChange={handleCategory}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Strategias"
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
          />
        )}
      />
    );
  };

  return (
    <>
      <Grid container>
        <Card sx={{ width: '100%' }}>
          <CustomCardHeader title={'Metricas'} initialLetter={'M'} avatarColor={'secondary.main'} />
          <CardContent>
            <Grid container direction={'row'} spacing={1}>
              <Grid item lg={4} xl={4}>
                <Card>
                  <CardHeader
                    subheader={'Indicador de gestión'}
                    action={
                      <IconButton aria-label="settings" onClick={setOpenDialog}>
                        <AddIcon />
                      </IconButton>
                    }
                  />
                  {strategies
                    ? strategies.map((eachStrategy, index) => {
                        return (
                          <Card key={index} sx={{ margin: 0.5 }}>
                            <CardContent>
                              <Stack
                                direction="column"
                                spacing={1}
                                divider={<Divider orientation="horizontal" flexItem />}
                              >
                                {eachStrategy.kpisData
                                  ? eachStrategy.kpisData.map((kpi, index) => {
                                      return (
                                        <Typography variant="body1" key={index}>
                                          {kpi.description}
                                        </Typography>
                                      );
                                    })
                                  : 'Actualmente no hay kpis creadas'}
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })
                    : 'Actualmente no hay estrtegias creadas'}
                </Card>
              </Grid>
              <Grid item lg={8} xl={8}>
                <Actions measures={measures} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <CustomDialog
        open={openDialog}
        title={'Indicador de gestión'}
        handleClose={setOpenDialog}
        requestMethod={createMeasure}
        displayDropdown={renderStrategiesDropdown()}
        newObject={newMeasure}
        setNewObject={setNewMeasure}
        nameMethod={'create'}
      />
    </>
  );
};

export default Measures;
