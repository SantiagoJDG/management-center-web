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
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCategories = async () => {
    try {
      let path = `/api/business-plan/category`;
      let response = await getAxiosInstance().get(path);
      console.log(response.data);
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
              <IconButton aria-label="settings" onClick={() => handleClickOpen()}>
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent>
            {goals?.map((eachGoal, index) => {
              return (
                <Card key={index}>
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
            })}
          </CardContent>
        </Card>
      </Grid>
      <CreateDialog
        open={open}
        title={'Nueva meta'}
        handleClose={handleClose}
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
