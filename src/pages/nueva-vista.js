import 'moment/locale/es';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid } from '@material-ui/core';
import { getAxiosInstance } from 'utils/axiosClient';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }
}));
const nueva_vista = () => {
  const styles = useStyles();
  const [file, setFile] = useState(null);
  const [newCollaborator, setnewCollaborator] = useState({
    name: '',
    lastName: '',
    birthdate: '',
    personalEmail: '',
    residency: '',
    nationalities: [1],
    contactPhones: [1]
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setnewCollaborator((prevState) => ({
      ...prevState,
      [name]: value
    }));
    console.log(newCollaborator);
  };

  const peticionPost = async () => {
    let path = 'http://localhost:3001/api/collaborator/';
    const formData = new FormData();
    formData.append('name', newCollaborator.name);
    formData.append('lastName', newCollaborator.lastName);
    formData.append('birthdate', newCollaborator.birthdate);
    formData.append('personalEmail', newCollaborator.personalEmail);
    formData.append('residency', newCollaborator.residency);
    formData.append('nationalities', JSON.stringify(newCollaborator.nationalities));
    formData.append('contactPhones', JSON.stringify(newCollaborator.contactPhones));
    formData.append('file', file);
    formData.append('folder', 'profiles_img_user');

    try {
      const response = await getAxiosInstance().post(path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container spacing={8}>
      <Grid item xs={12} lg={4}>
        <TextField
          name="name"
          className={styles.inputMaterial}
          label="Name"
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} lg={4}>
        <TextField
          name="lastName"
          className={styles.inputMaterial}
          label="Last Name"
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TextField
          name="birthdate"
          className={styles.inputMaterial}
          label="- "
          onChange={handleChange}
          type="date"
        />
      </Grid>

      <Grid item xs={12} lg={4}>
        <TextField
          name="personalEmail"
          className={styles.inputMaterial}
          label="Personal Email"
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TextField
          name="residency"
          className={styles.inputMaterial}
          label="Residency"
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TextField
          name="nationalities"
          className={styles.inputMaterial}
          label="Nationalities"
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TextField
          name="contactPhones"
          className={styles.inputMaterial}
          label="contact Phones"
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <TextField
          name="photoAddress"
          className={styles.inputMaterial}
          label="Photo "
          type="file"
          onChange={handleFileChange}
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Button variant="contained" color="success" onClick={() => peticionPost()}>
          {' '}
          Insertar
        </Button>
      </Grid>
    </Grid>
  );
};

export default nueva_vista;
