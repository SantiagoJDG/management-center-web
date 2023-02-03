import {
  Card,
  Grid,
  CardHeader,
  Avatar,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import { getAxiosInstance } from 'utils/axiosClient';

import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';

import CreateDialog from 'components/PlannerDashboard/CreateDialog';

const Goals = ({ goals, userId, businessPlanObjective }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  const getCategories = async () => {
    try {
      let path = `/api/business-plan/goal/category`;
      let response = await getAxiosInstance().get(path);
      setCategories(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Grid container>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            sx={{ bgcolor: 'primary.main' }}
            avatar={
              <Avatar sx={{ bgcolor: 'warning.main' }} aria-label="recipe">
                G
              </Avatar>
            }
            title={'Goals'}
            action={
              <IconButton aria-label="settings" onClick={() => handleClickOpenDialog()}>
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent>
            {goals
              ? goals.map((eachGoal, index) => {
                  return (
                    <Card key={index} sx={{ margin: 0.5 }}>
                      {eachGoal.categoryData ? (
                        <CardHeader subheader={eachGoal.categoryData.name} />
                      ) : (
                        ''
                      )}
                      <CardContent>
                        <Stack
                          direction="column"
                          spacing={1}
                          divider={<Divider orientation="horizontal" flexItem />}
                        >
                          <Typography variant="body1" key={index}>
                            {eachGoal.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })
              : 'No existen metas creadas'}
          </CardContent>
        </Card>
      </Grid>
      <CreateDialog
        open={openDialog}
        title={'Nueva meta'}
        handleClose={handleClickCloseDialog}
        dropdownList={categories}
        setDropdownListState={setCategories}
        requiredField={true}
        path={'/api/business-plan/goal'}
        getList={getCategories}
        authorid={userId}
        businessObjectiveId={businessPlanObjective}
      />
    </>
  );
};

export default Goals;
