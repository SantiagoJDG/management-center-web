import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  ListItemIcon,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import HailRoundedIcon from '@mui/icons-material/HailRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonalInformation from '../components/Collaborators/CreateCollaboratorSteps/Personalnformation';
import CreateCollaboratorSteps2 from 'components/Collaborators/CreateCollaboratorSteps/create-collaborator-steps 2';
import { useRef, useState } from 'react';

const CreateCollaboratorSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const formValidate = useRef(null);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      id: 1,
      title: 'Llena la Infomacion personal',
      stepName: 'Agregar Informacion Personal',
      component: <PersonalInformation ref={formValidate} setActiveStep={setActiveStep} />
    },
    {
      id: 2,
      title: 'Este seria el paso 2',
      stepName: 'Paso 2',
      component: <CreateCollaboratorSteps2 />
    }
  ];

  const handleNext = () => {
    formValidate.current();
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setSkipped(newSkipped);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const finishedStepsOptions = () => {
    return (
      <Grid item>
        <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      </Grid>
    );
  };

  const backSkipNextButtons = () => {
    return (
      <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Volver
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Saltar
            </Button>
          )}

          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
          </Button>
        </Box>
      </Grid>
    );
  };

  return (
    <>
      <Grid container xs={12} sx={{ display: 'flex', m: 1 }}>
        <ListItemIcon>
          <HailRoundedIcon fontSize="large" style={{ color: '#2196f3' }} />
        </ListItemIcon>

        <Typography variant="h5" color={'#2196f3'}>
          Agregar nuevo consultor
        </Typography>
      </Grid>
      <Grid container xs={10} direction="column" p={1}>
        <Paper
          elevation={1}
          sx={{
            backgroundImage: "url('/background_sidebar_mirror.png')",
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Grid item>
            <Grid container xs={12} justifyContent="space-between" sx={{ p: 1 }}>
              <Grid item p={1}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                  <Typography variant="h9">{steps[activeStep].stepName}</Typography>
                </ListItemIcon>
              </Grid>
              <Grid item>
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};
                      if (isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                      }
                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                      }
                      return (
                        <Step key={label.id} {...stepProps}>
                          <StepLabel {...labelProps}>{label.title}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={10} sx={{ marginLeft: 3 }}>
            {steps[activeStep].component}
          </Grid>
        </Paper>

        <Grid item sx={12}>
          <Grid container>
            {activeStep === steps.length ? finishedStepsOptions() : backSkipNextButtons()}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateCollaboratorSteps;
