import { Grid, Divider, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { getAxiosInstance } from 'utils/axiosClient';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import 'moment/locale/es';
import { useState, useEffect, forwardRef } from 'react';
import useEdit from 'hooks/useEdit';
import { CssTextField } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';

const ContractInformationStepThree = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors }
  } = useForm();
  const [mounted, setMounted] = useState(false);
  const { handleNewMessage } = useMessage();
  const [contractInformation, setContractInformation] = useState({
    companyId: '',
    officeId: '',
    type: undefined,
    durability: undefined,
    initialDate: '',
    endDate: '',
    expireTime: '',
    currency: '',
    salary: ''
  });
  const [edit] = useEdit('/api/collaborator', contractInformation);

  const [initialDate, setInitialDate] = useState();
  const [expirationTime, setExpirationTime] = useState('');
  const [offices, setOffices] = useState([]);
  const [contractType, setContractType] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyErrors, setCompanyErrors] = useState({});

  const getResidenceData = async () => {
    getDataInformation('/api/hiring/offices', setOffices);
    getDataInformation('/api/hiring/types', setContractType);
    getDataInformation('/api/hiring/companies', setCompanies);
  };

  const getDataInformation = (path, callbackMethod) => {
    getAxiosInstance()
      .get(path)
      .then((response) => {
        callbackMethod(response.data);
      })
      .catch((error) => {
        console.error(`Error while get Data from ${path}`, error);
      });
  };

  async function saveNewItem(paths, newItem) {
    try {
      let createdItem = await getAxiosInstance().post(paths, newItem);
      return createdItem.data;
    } catch (error) {
      console.error('Error while save new item...', error);
    }
  }

  async function handleAutoCompleteValue(
    selectedValue,
    elementName,
    pathToSaveNew,
    callbackAfetedSaved,
    previousElements
  ) {
    if (!selectedValue) return;
    if (!selectedValue.id) {
      let idReturned = await saveNewItem(pathToSaveNew, selectedValue);
      selectedValue.id = idReturned;
      callbackAfetedSaved([...previousElements, selectedValue]);
    }
    setContractInformation({
      ...contractInformation,
      [elementName]: selectedValue.id
    });

    setCompanyErrors({ ...companyErrors, [elementName]: { error: false, description: '' } });
  }

  function handleOffice(office) {
    handleAutoCompleteValue(
      office,
      'contractCofficeId',
      '/api/hiring/offices',
      setOffices,
      offices
    );
  }
  function handleTypeOfContract(type) {
    handleAutoCompleteValue(
      type,
      'typeOfContract',
      '/api/hiring/types',
      setContractType,
      contractType
    );
  }
  function handleCompanies(office) {
    handleAutoCompleteValue(office, 'companyId', '/api/hiring/companies', setCompanies, companies);
  }

  const handleOnChangeInitialDate = (newValue) => {
    setContractInformation({ ...contractInformation, initialDate: moment(newValue).format() });
    setInitialDate(moment(newValue).format());
  };

  function handleOnChangeEndDate(newValue) {
    setContractInformation({ ...contractInformation, endDate: newValue.format('YYYY-MM-DD') });
    const monthOfRelativeDate = moment().month(newValue.month()).fromNow(true);
    const yearOfRelativeDate = moment(newValue).from(initialDate);
    setExpirationTime(`${yearOfRelativeDate} y ${monthOfRelativeDate}`);
  }

  const handleDropdownErrors = () => {
    if (
      !contractInformation.companyId ||
      !contractInformation.officeId ||
      !contractInformation.type
    ) {
      const newErrors = {
        ...companyErrors,
        companyId: {
          ...(contractInformation.company ? {} : { error: true, description: 'Campo requerido' })
        },
        contractCofficeId: {
          ...(contractInformation.offices ? {} : { error: true, description: 'Campo requerido' })
        },
        typeOfContract: {
          ...(contractInformation.type ? {} : { error: true, description: 'Campo requerido' })
        }
      };
      setCompanyErrors(newErrors);
    }
  };

  const validateForm = () => {
    handleDropdownErrors();
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const error = await edit();
        if (error) return;
        handleNewMessage({
          text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
          severity: 'success'
        });
        props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })();
    }
  };

  useEffect(() => {
    if (!mounted) {
      getResidenceData();
      setMounted(true);
    }
    ref.current = validateForm;
  }, [contractInformation, mounted]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item>
            <CustomAutoComplete
              formError={companyErrors.companyId}
              name="companyId"
              label="Empresa Contratante"
              optionList={companies}
              elmentCallback={handleCompanies}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={companyErrors.contractCofficeId}
              name="officeId"
              label="Oficina de contrato"
              optionList={offices}
              elmentCallback={handleOffice}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={companyErrors.typeOfContract}
              name="contractId"
              label="Tipo de contrato"
              optionList={contractType}
              elmentCallback={handleTypeOfContract}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              name="contractDurability"
              size="small"
              label="Vigencia del contrato"
              {...register('contractDurability', {
                required: true,
                onChange: (event) =>
                  setContractInformation({
                    ...contractInformation,
                    durability: event.target.value
                  })
              })}
              error={errors.contractDurability && true}
              helperText={
                errors.contractDurability && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="initialDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de Inicio"
                    maxDate={moment().format()}
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleOnChangeInitialDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        label={'Fecha de Inicio'}
                        placeholder="DD/MM/YYYY"
                        name="initialDate"
                        error={errors.initialDate && true}
                        size="small"
                        helperText={
                          errors.initialDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('initialDate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="endDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de Finalizacion"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleOnChangeEndDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        size="small"
                        required
                        label={'Fecha de Finalizacion'}
                        placeholder="DD/MM/YYYY"
                        name="endDate"
                        error={errors.endDate && true}
                        helperText={
                          errors.endDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('endDate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              size="small"
              label="Tiempo de caducidad"
              value={expirationTime}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item sx={{ display: 'flex' }}>
            <CssTextField
              sx={{ width: '30%' }}
              label="Moneda"
              value={contractInformation.currency}
              InputProps={{
                readOnly: true
              }}
              size="small"
              variant="outlined"
            />
            <CssTextField
              sx={{ width: '65%', ml: 1 }}
              required
              type="number"
              size="small"
              name="salary"
              placeholder="$0000.00"
              label="Tarifa mensual bruta"
              {...register('salary', {
                required: true,
                onChange: (event) => {
                  setContractInformation({
                    ...contractInformation,
                    salary: event.target.value
                  });
                }
              })}
              error={errors.salary && true}
              helperText={
                errors.salary && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

ContractInformationStepThree.displayName = 'ContractInformationStepThree';
export default ContractInformationStepThree;
