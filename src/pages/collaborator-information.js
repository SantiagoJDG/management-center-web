import { Box, Button, Grid, Paper, Tabs, Tab, Typography } from '@mui/material';
import BillingInformationStepFive from 'components/Collaborators/CreateCollaboratorSteps/BillingInformationStepFive';
import ContractInformationStepThree from 'components/Collaborators/CreateCollaboratorSteps/ContractInformationStepThree';
import FinalContractStepNine from 'components/Collaborators/CreateCollaboratorSteps/FinalContractStepNine';
import IdentityInformationStepEight from 'components/Collaborators/CreateCollaboratorSteps/IdentityInformationStepEight';
import OrganizationalStructureStepSeven from 'components/Collaborators/CreateCollaboratorSteps/OrganizationalStructureStepSeven';
import PaymentInformationStepFour from 'components/Collaborators/CreateCollaboratorSteps/PaymentInformationStepFour';
import RateIncreaseStepSix from 'components/Collaborators/CreateCollaboratorSteps/RateIncreaseStepSix';
import PersonalInformation from '../components/Collaborators/CollaboratorEditableInformation/PersonalInformation';
import CompanyInformation from '../components/Collaborators/CollaboratorEditableInformation/CompanyInformation';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const CollaboratorInformation = () => {
  const { userToken, waitingUser } = useAuth();
  const [value, setValue] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [editMode, setEditMode] = useState(true);
  const formValidate = useRef(null);
  const router = useRouter();
  const [collaboratorId] = useState(sessionStorage.getItem('collaboratorId'));

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      id: 1,
      backgroungImg: '/pills-cut-right.png',
      component: (
        <PersonalInformation
          ref={formValidate}
          editable={editMode}
          collaboratorId={collaboratorId}
        />
      )
    },
    {
      id: 2,
      backgroungImg: '/pills-orange.png',
      component: <CompanyInformation />
    },
    {
      id: 3,
      backgroungImg: '/pills-green.png',
      component: <ContractInformationStepThree ref={formValidate} />
    },
    {
      id: 4,
      backgroungImg: '/pills-cyan.png',
      component: <PaymentInformationStepFour ref={formValidate} />
    },
    {
      id: 5,
      backgroungImg: '/pills-cut-right.png',
      component: <BillingInformationStepFive ref={formValidate} />
    },
    {
      id: 6,
      backgroungImg: '/pills-cyan.png',
      component: <RateIncreaseStepSix ref={formValidate} />
    },
    {
      id: 7,
      backgroungImg: '/pills-orange.png',
      component: <OrganizationalStructureStepSeven ref={formValidate} />
    },
    {
      id: 8,
      backgroungImg: '/pills-cut-right.png',
      component: <IdentityInformationStepEight ref={formValidate} />
    },
    {
      id: 9,
      backgroungImg: '/pills-orange.png',
      component: <FinalContractStepNine ref={formValidate} />
    }
  ];

  const handleNext = () => {
    setEditMode(false);
    formValidate.current();

    if (activeStep === steps.length - 1) {
      router.push('/');
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setActiveStep(newValue);
  };

  const backSkipNextButtons = () => {
    return (
      <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button
            onClick={handleNext}
            size={'small'}
            variant="contained"
            color={'primary'}
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
              Editar
            </Typography>
          </Button>
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
      <Grid container xs={10} direction="column" p={1}>
        <Paper
          elevation={1}
          sx={{
            backgroundImage: `url(${steps[value].backgroungImg})`,
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
              <Grid item>
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Informacion Personal" />
                    <Tab value={1} label="ID Corporativo" />
                    <Tab value={2} label="Contactual" />
                    <Tab value={3} label="Pago" />
                    <Tab value={4} label="C&B" />
                    <Tab value={5} label="Estructura Organizacional" />
                    <Tab value={6} label="Identidad Consultec" />
                  </Tabs>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item flexGrow={1} xs={10} sx={{ marginLeft: 3 }}>
            {steps[value].component}
          </Grid>
        </Paper>

        <Grid item xs={12}>
          <Grid container>{backSkipNextButtons()}</Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CollaboratorInformation;
