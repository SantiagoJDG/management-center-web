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
import { CssTextField } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';
import useCreate from 'hooks/useCreate';

const ContractInformationStepThree = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();

  const [mounted, setMounted] = useState(false);
  const { handleNewMessage } = useMessage();
  const [contractInformation, setContractInformation] = useState({
    companyId: 0,
    officeId: '',
    typeId: '',
    validityId: '',
    initialDate: '',
    endDate: '',
    currencyId: '',
    baseAmount: ''
  });

  const [create] = useCreate(
    `/api/collaborator/${props.newCollaboratorId}/contract`,
    contractInformation,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  const [initialDate, setInitialDate] = useState();
  const [expirationTime, setExpirationTime] = useState('');
  const [offices, setOffices] = useState([]);
  const [contractType, setContractType] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contractValidities, setContractValidities] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [companyErrors, setCompanyErrors] = useState({});

  const getCatalogseData = async () => {
    getDataInformation('/api/hiring/offices', setOffices);
    getDataInformation('/api/hiring/types', setContractType);
    getDataInformation('/api/hiring/companies', setCompanies);
    getDataInformation('/api/hiring/contract-validities', setContractValidities);
    getDataInformation('/api/hiring/currencies', setCurrencies);
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
    handleAutoCompleteValue(office, 'officeId', '/api/hiring/offices', setOffices, offices);
  }

  function handleContractType(type) {
    handleAutoCompleteValue(type, 'typeId', '/api/hiring/types', setContractType, contractType);
  }

  function handleCompanies(office) {
    handleAutoCompleteValue(office, 'companyId', '/api/hiring/companies', setCompanies, companies);
  }

  function handleContractValidity(validity) {
    handleAutoCompleteValue(
      validity,
      'validityId',
      '/api/hiring/contract-validity',
      setContractValidities,
      contractValidities
    );
  }

  function handleCurrency(currency) {
    handleAutoCompleteValue(
      currency,
      'currencyId',
      '/api/hiring/currency',
      setCurrencies,
      currencies
    );
  }

  function handleOnChangeInitialDate(newValue) {
    setContractInformation({
      ...contractInformation,
      initialDate: moment(newValue).format('YYYY-MM-DD')
    });
    setInitialDate(moment(newValue).format());
  }

  function handleOnChangeEndDate(newValue) {
    const monthOfRelativeDate = moment().month(moment(newValue).month()).fromNow(true);
    const yearOfRelativeDate = moment(newValue).from(initialDate);
    setExpirationTime(`${yearOfRelativeDate} y ${monthOfRelativeDate}`);
  }

  const handleDropdownErrors = () => {
    if (
      !contractInformation.companyId ||
      !contractInformation.officeId ||
      !contractInformation.typeId ||
      !contractInformation.validityId ||
      !contractInformation.currencyId
    ) {
      const newErrors = {
        ...companyErrors,
        companyId: {
          ...(contractInformation.companyId ? {} : { error: true, description: 'Campo requerido' })
        },
        officeId: {
          ...(contractInformation.officeId ? {} : { error: true, description: 'Campo requerido' })
        },
        typeId: {
          ...(contractInformation.typeId ? {} : { error: true, description: 'Campo requerido' })
        },
        validityId: {
          ...(contractInformation.validityId ? {} : { error: true, description: 'Campo requerido' })
        },
        currencyId: {
          ...(contractInformation.currencyId ? {} : { error: true, description: 'Campo requerido' })
        }
      };
      setCompanyErrors(newErrors);
    }
  };

  const afterExecution = (execution) => {
    if (execution.status !== 200 || execution.data === 'SequelizeUniqueConstraintError') {
      handleNewMessage({
        text: 'Por favor revisar los campos que deben ser unicos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion de contratación fué creada exitosamente',
        severity: 'success'
      });
      props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      props.setFormCompleted(false);
      props.rememberStepFormInformation(props.stepName, contractInformation);
    }
  };

  const validateForm = () => {
    handleDropdownErrors();
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const response = await create();
        afterExecution(response);
      })();
    }
  };

  const findObject = (array, id) => {
    const finded = array.find((each) => {
      return each.id === id;
    });
    return finded;
  };

  const returnedStep = (formData) => {
    setContractInformation(formData);
    handleOnChangeEndDate(formData.endDate);
  };

  useEffect(() => {
    if (!mounted) {
      getCatalogseData();
      setMounted(true);
      if (Object.keys(props.formData).length) {
        const { formData } = props;

        returnedStep(formData);
      }
    }
    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }

    ref.current = validateForm;
  }, [contractInformation, mounted]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item sx={{ width: '23vw' }}>
            <CustomAutoComplete
              formError={companyErrors.companyId}
              name="companyId"
              label="Empresa Contratante"
              optionList={companies}
              elmentCallback={handleCompanies}
              requiredField={true}
              canCreateNew={false}
              prechargedValue={
                props.formData ? findObject(companies, props.formData.companyId) : ''
              }
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={companyErrors.officeId}
              name="officeId"
              label="Oficina de contrato"
              optionList={offices}
              elmentCallback={handleOffice}
              requiredField={true}
              canCreateNew={false}
              prechargedValue={props.formData ? findObject(offices, props.formData.officeId) : ''}
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={companyErrors.typeId}
              name="typeId"
              label="Tipo de contrato"
              optionList={contractType}
              elmentCallback={handleContractType}
              requiredField={true}
              canCreateNew={false}
              prechargedValue={
                props.formData ? findObject(contractType, props.formData.typeId) : ''
              }
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={companyErrors.validityId}
              name="validityId"
              label="Vigencia del contrato"
              optionList={contractValidities}
              elmentCallback={handleContractValidity}
              requiredField={true}
              canCreateNew={false}
              prechargedValue={
                props.formData ? findObject(contractValidities, props.formData.validityId) : ''
              }
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="initialDate"
                control={control}
                defaultValue={
                  Object.keys(props.formData).length
                    ? moment(props.formData.initialDate).format('YYYY-MM-DD')
                    : ''
                }
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
          <Grid item sx={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="endDate"
                control={control}
                defaultValue={
                  Object.keys(props.formData).length
                    ? moment(props.formData.endDate).format('YYYY-MM-DD')
                    : ''
                }
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de Finalizacion"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      setContractInformation({
                        ...contractInformation,
                        endDate: moment(newValue).format('YYYY-MM-DD')
                      });
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
            <CustomAutoComplete
              formError={companyErrors.currencyId}
              name="currencyId"
              label="Moneda"
              optionList={currencies}
              elmentCallback={handleCurrency}
              requiredField={true}
              canCreateNew={false}
              prechargedValue={
                props.formData ? findObject(currencies, props.formData.currencyId) : ''
              }
            />

            <CssTextField
              sx={{ ml: 1 }}
              required
              type="number"
              size="small"
              name="baseAmount"
              placeholder="$0000.00"
              defaultValue={props.formData ? props.formData.baseAmount : ''}
              label="Tarifa mensual bruta"
              {...register('baseAmount', {
                required: true,
                onChange: (event) => {
                  setContractInformation({
                    ...contractInformation,
                    baseAmount: event.target.value
                  });
                }
              })}
              error={errors.baseAmount && true}
              helperText={
                errors.baseAmount && (
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
