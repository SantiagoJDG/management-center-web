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
import PersonalInformationStepOne from 'components/Collaborators/CreateCollaboratorSteps/PersonalnformationStepOne';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const CollaboratorInformation = () => {
  const { userToken, waitingUser } = useAuth();
  const [collaboratorId, setCollaboratorId] = useState();

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(true);

  const formValidate = useRef(null);
  const router = useRouter();

  const optionTabs = [
    {
      id: 1,
      label: 'Informacion Personal',
      backgroungImg: '/pills-cut-right.png',
      component: editMode ? (
        <PersonalInformation
          ref={formValidate}
          editable={editMode}
          collaboratorId={collaboratorId}
        />
      ) : (
        <Grid pt={10}>
          <PersonalInformationStepOne formData={{}} ref={formValidate} />
        </Grid>
      )
    },
    {
      id: 2,
      label: 'Contractual',
      backgroungImg: '/pills-orange.png',
      component: <CompanyInformation />
    },
    {
      id: 3,
      label: 'Pago',
      backgroungImg: '/pills-green.png',
      component: <ContractInformationStepThree ref={formValidate} />
    },
    {
      id: 4,
      label: 'C&B',
      backgroungImg: '/pills-cyan.png',
      component: <PaymentInformationStepFour ref={formValidate} />
    },
    {
      id: 5,
      label: 'Estructura Organizacional',
      backgroungImg: '/pills-cut-right.png',
      component: <BillingInformationStepFive ref={formValidate} />
    },
    {
      id: 6,
      label: 'Identidad Consultec',
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

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const editBackButtons = () => {
    return (
      <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button
            size={'small'}
            variant="contained"
            color={'primary'}
            onClick={() => setEditMode(!editMode)}
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
          <Button variant="outlined" size={'small'} sx={{ borderRadius: 8, mt: 1, mr: 1 }}>
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
    const collaboratorId = sessionStorage.getItem('collaboratorId');
    if (collaboratorId) {
      setCollaboratorId(collaboratorId);
    }
  }, [userToken, waitingUser]);

  return (
    collaboratorId && (
      <>
        <Grid container xs={10} direction="column" p={1}>
          <Paper
            elevation={1}
            sx={{
              backgroundImage: `url(${optionTabs[activeTab].backgroungImg})`,
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
                      value={activeTab}
                      onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      {optionTabs.map((tab, index) => {
                        return <Tab key={tab.id} value={index} label={tab.label} />;
                      })}
                    </Tabs>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item flexGrow={1} xs={10} sx={{ marginLeft: 3 }}>
              {optionTabs[activeTab].component}
            </Grid>
          </Paper>

          <Grid item xs={12}>
            <Grid container>{editBackButtons()}</Grid>
          </Grid>
        </Grid>
      </>
    )
  );
};

export default CollaboratorInformation;
