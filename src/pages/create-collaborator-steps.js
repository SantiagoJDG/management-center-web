import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HailRoundedIcon from '@mui/icons-material/HailRounded';
import {
  Box,
  Button,
  Grid,
  ListItemIcon,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import BillingInformationStepFive from 'components/Collaborators/CreateCollaboratorSteps/BillingInformationStepFive';
import CompanyInformationStepTwo from 'components/Collaborators/CreateCollaboratorSteps/CompanyInformationStepTwo';
import ContractInformationStepThree from 'components/Collaborators/CreateCollaboratorSteps/ContractInformationStepThree';
import FinalContractStepNine from 'components/Collaborators/CreateCollaboratorSteps/FinalContractStepNine';
import IdentityInformationStepEight from 'components/Collaborators/CreateCollaboratorSteps/IdentityInformationStepEight';
import OrganizationalStructureStepSeven from 'components/Collaborators/CreateCollaboratorSteps/OrganizationalStructureStepSeven';
import PaymentInformationStepFour from 'components/Collaborators/CreateCollaboratorSteps/PaymentInformationStepFour';
import RateIncreaseStepSix from 'components/Collaborators/CreateCollaboratorSteps/RateIncreaseStepSix';
import PersonalInformationStepOne from '../components/Collaborators/CreateCollaboratorSteps/PersonalnformationStepOne';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const CreateCollaboratorSteps = () => {
  const { userToken, waitingUser } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [formCompleted, setFormCompleted] = useState(false);
  const formValidate = useRef(null);
  const [newCollaboratorId, setNewCollaboratorId] = useState(null);
  const router = useRouter();

  const [formStepInformationData, setFormStepInformationKepper] = useState({
    firstStepForm: {},
    secondStepForm: {},
    thirdStepForm: {},
    fourthStepForm: {},
    fifthStepForm: {},
    sixthStepForm: {},
    seventhStepForm: {},
    eighthStepForm: {}
  });

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const isStepOptionals = (step) => {
    switch (step) {
      case 5:
        return true;
      case 7:
        return true;
      case 0:
        return false;
      default:
        return false;
    }
  };
  const handleSkip = () => {
    if (!isStepOptionals(activeStep)) {
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
    setFormCompleted(true);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const rememberStepFormInformation = (stepName, formInfo) => {
    setFormStepInformationKepper({
      ...formStepInformationData,
      [stepName]: formInfo
    });
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
          newCollaboratorId={newCollaboratorId}
          setFormCompleted={setFormCompleted}
          stepName={'firstStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.firstStepForm}
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
          setFormCompleted={setFormCompleted}
          stepName={'secondStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.secondStepForm}
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
          setFormCompleted={setFormCompleted}
          stepName={'thirdStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.thirdStepForm}
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
          setFormCompleted={setFormCompleted}
          stepName={'fourthStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.fourthStepForm}
        />
      )
    },
    {
      id: 5,
      title: 'Compensación & Beneficios USD$',
      stepName: 'Información de compensación & Beneficios',
      backgroungImg: '/pills-cut-right.png',
      component: (
        <BillingInformationStepFive
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
          setFormCompleted={setFormCompleted}
          stepName={'fifthStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.fifthStepForm}
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
          setFormCompleted={setFormCompleted}
          stepName={'sixthStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.sixthStepForm}
        />
      )
    },
    {
      id: 7,
      title: 'Estructura organizacional',
      stepName: 'Informacion de estructura organizacional',
      backgroungImg: '/pills-orange.png',
      component: (
        <OrganizationalStructureStepSeven
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
          setFormCompleted={setFormCompleted}
          stepName={'seventhStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.seventhStepForm}
        />
      )
    },
    {
      id: 8,
      title: 'Identidad Consultec',
      stepName: 'Información de Identidad Consultec',
      backgroungImg: '/pills-cut-right.png',
      component: (
        <IdentityInformationStepEight
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
          setFormCompleted={setFormCompleted}
          stepName={'eighthStepForm'}
          rememberStepFormInformation={rememberStepFormInformation}
          formData={formStepInformationData.eighthStepForm}
        />
      )
    },
    {
      id: 9,
      title: 'Final de contratación',
      stepName: 'Información final de contratación',
      backgroungImg: '/pills-orange.png',
      component: (
        <FinalContractStepNine
          ref={formValidate}
          setActiveStep={setActiveStep}
          newCollaboratorId={newCollaboratorId}
          setFormCompleted={setFormCompleted}
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

    if (activeStep === steps.length - 1) {
      router.push('/');
    }
  };

  const handleReset = () => {
    setActiveStep(1);
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
            onClick={handleNext}
            size={'small'}
            variant="contained"
            color={formCompleted ? 'primary' : 'inherit'}
            disabled={!formCompleted}
            sx={{
              borderRadius: 8,
              mt: 1,
              mr: 1,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            <Typography sx={{ pl: 5, pr: 5 }} color="white">
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Editar'}
            </Typography>
          </Button>
          {isStepOptionals(activeStep) && (
            <Button
              onClick={handleSkip}
              variant="outlined"
              size={'small'}
              sx={{ borderRadius: 8, mt: 1, ml: 1 }}
            >
              <Typography sx={{ pl: 5, pr: 5 }}>Saltar paso</Typography>
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleBack}
            size={'small'}
            sx={{ borderRadius: 8, mt: 1, mr: 1 }}
          >
            <Typography sx={{ pl: 5, pr: 5 }}>Volver</Typography>
          </Button>
        </Box>
      </Grid>
    );
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
    }
  }, [userToken, waitingUser]);

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
                            <Typography variant="caption">
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
