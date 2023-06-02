import { Grid, Divider } from '@mui/material';
// import CustomAutoComplete from 'components/CustomAutoComplete';
// import { getAxiosInstance } from 'utils/axiosClient';
// import { useForm, Controller } from,,. 'react-hook-form';
import 'moment/locale/es';
import { forwardRef, useState } from 'react';
// import useCreate from 'hooks/useCreate';
// import { CssTextField } from '../../../styles/formButton';
// import useMessage from 'hooks/useMessage';

const BillingInformationStepFive = forwardRef(() => {
  const [billingInformation, setBillingInformation] = useState({
    usdBaseFee: '',
    calculatation: '',
    calculationFee: '',
    complementFee: '',
    usdMonthlyFee: '',
    periodicity: '',
    duration: '',
    usdAnualComplementFee: '',
    insurance: '',
    insuranceFee: ''
  });

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

BillingInformationStepFive.displayName = 'BillingInformationStepFive';
export default BillingInformationStepFive;
