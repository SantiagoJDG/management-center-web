import { useEffect } from 'react';

import { Avatar, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import Script from 'next/script';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { userToken, waitingUser, userData, saveUserSession } = useAuth();

  const router = useRouter();

  const saveToken = async (response) => {
    sessionStorage.setItem('center-token', response.credential);
    await saveUserSession(response.credential);

    router.push('/collaborator?id=1');
  };

  const showLoginOptions = () => {};
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        // strategy="beforeInteractive"
        onReady={() => {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_MANAGEMENT_CENTER_CLIENT_ID,
            callback: saveToken
          });

          const token = sessionStorage.getItem('center-token');

          if (!token) {
            google.accounts.id.renderButton(document.getElementById('googleButton'), {
              theme: 'filled_blue',
              size: 'large',
              shape: 'pill',
              select_by: 'auto'
            });

            // google.accounts.id.prompt();
          }
        }}
      />
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <Paper
            elevation={20}
            sx={{
              borderRadius: 1,
              minWidth: 350,
              minHeight: 450,
              my: 10,
              mx: 5
            }}
          >
            <Grid container rowSpacing={2} direction="column" alignItems="center">
              <Grid item xs>
                <Avatar
                  aria-label="logo"
                  sx={{ width: 200, height: 200 }}
                  alt="LOGO"
                  src="/consultec_logo.jpg"
                ></Avatar>
              </Grid>
              <Grid item xs>
                <h3>{!waitingUser && userToken ? 'Usuario Autenticado' : 'Ingresar con Google'}</h3>
              </Grid>
              <Grid item xs>
                <div style={{ margin: '1rem' }} id="googleButton"></div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
