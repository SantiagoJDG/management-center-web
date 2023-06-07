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
import PersonalInformationStepOne from '../components/Collaborators/CreateCollaboratorSteps/PersonalnformationStepOne';
import CompanyInformationStepTwo from 'components/Collaborators/CreateCollaboratorSteps/CompanyInformationStepTwo';
import ContractInformationStepThree from 'components/Collaborators/CreateCollaboratorSteps/ContractInformationStepThree';
import PaymentInformationStepFour from 'components/Collaborators/CreateCollaboratorSteps/PaymentInformationStepFour';
import RateIncreaseStepSix from 'components/Collaborators/CreateCollaboratorSteps/RateIncreaseStepSix';
import { useRef, useState } from 'react';

const CreateCollaboratorSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const formValidate = useRef(null);
  const [newCollaboratorId, setNewCollaboratorId] = useState(null);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const isStepOptional = (step) => {
    return step === 1;
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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      id: 1,
      title: 'Llena la Infomacion personal',
      stepName: 'Agregar Informacion Personal',
      backgroungImg: '/pills-cut-right.png',
      component: (
        <PersonalInformationStepOne
          ref={formValidate}
          setActiveStep={setActiveStep}
          setNewCollaboratorId={setNewCollaboratorId}
        />
      )
    },
    {
      id: 2,
      title: 'Llena la informacion personal en la empresa',
      stepName: 'Informacion de alta en la empresa',
      backgroungImg: '/pills-orange.png',
      component: (
        <CompanyInformationStepTwo
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
        />
      )
    },
    {
      id: 3,
      title: 'Llena la Información de contratacion',
      stepName: 'Información de contratación',
      backgroungImg: '/pills-green.png',
      component: (
        <ContractInformationStepThree
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
        />
      )
    },
    {
      id: 4,
      title: 'Llena la información de pago   ',
      stepName: 'Información de pago',
      backgroungImg: '/pills-cyan.png',
      component: (
        <PaymentInformationStepFour
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
        />
      )
    },
    {
      id: 6,
      title: 'Llena la información de incremento de tarifa',
      stepName: 'Información de incremento de tarifa',
      backgroungImg: '/pills-cyan.png',
      component: (
        <RateIncreaseStepSix
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
        />
      )
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
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            size={'small'}
            sx={{ borderRadius: 8, mt: 1, backgroundColor: '#D3D3D3' }}
          >
            <Typography sx={{ pl: 5, pr: 5 }} color="white">
              Volver
            </Typography>
          </Button>
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              <Typography sx={{ pl: 5, pr: 5 }} color="white">
                Saltar paso
              </Typography>
            </Button>
          )}
          <Button
            onClick={handleNext}
            variant="outlined"
            size={'small'}
            sx={{ borderRadius: 8, mt: 1, ml: 1 }}
          >
            <Typography sx={{ pl: 5, pr: 5 }}>
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
            </Typography>
          </Button>
        </Box>
      </Grid>
    );
  };

  return (
    <>
      <Grid container xs={12} sx={{ display: 'flex', m: 0.5 }}>
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
            backgroundImage: `url(${steps[activeStep].backgroungImg})`,
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '30%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '75vh',
            height: 'auto'
          }}
        >
          <Grid item>
            <Grid container xs={12} justifyContent="space-between" sx={{ p: 1 }}>
              <Grid item p={0.5}>
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
                      return (
                        <Step key={label.id} {...stepProps}>
                          <StepLabel {...labelProps}>
                            <Typography variant="body2">
                              {index === activeStep ? label.title : ''}
                            </Typography>
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item flexGrow={1} xs={10} sx={{ marginLeft: 3 }}>
            {steps[activeStep].component}
          </Grid>
        </Paper>

        <Grid item xs={12}>
          <Grid container>
            {activeStep === steps.length ? finishedStepsOptions() : backSkipNextButtons()}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateCollaboratorSteps;
