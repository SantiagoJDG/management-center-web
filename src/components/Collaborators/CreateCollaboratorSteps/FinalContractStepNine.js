import { CardMedia, Divider, Grid } from '@mui/material';
import 'moment/locale/es';
import { forwardRef, useEffect } from 'react';

const FinalContractStepNine = forwardRef((props, ref) => {
  useEffect(() => {
    ref.current = () => {};
    props.setFormCompleted(true);
  }, []);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={4} p={2}>
          <Grid item>
            <div style={{ textAlign: 'center', color: 'green' }}>
              <p style={{ fontSize: '30px' }}>El proceso se ha completado.</p>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <CardMedia
            sx={{
              width: 400,
              height: 400,
              margin: 1
            }}
            image="prop-0.png"
          />
        </Grid>
      </Grid>
    </Grid>
  );
});

FinalContractStepNine.displayName = 'FinalContractStepNine';
export default FinalContractStepNine;
