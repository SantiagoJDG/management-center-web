import Head from 'next/head';
import { Grid, Box, CssBaseline, Typography, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText } from '@mui/material';

import Script from 'next/script';
import useAuth from '../hooks/useAuth';

import Sidebar from '../components/Sidebar';
import MainHeader from 'components/MainHeader';
import { useState } from 'react';

const drawerWidth = 240;

const MainLayout = (props) => {

  const { setUserToken, setWaitingUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const saveToken = async (response) => {
    sessionStorage.setItem('center-token', response.credential);
    setUserToken(response.credential);
    setWaitingUser(false);
  };

  return (
    <>
      <Head>
        <title>Management Center</title>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon-apple.png" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Management center was created by Consultec-TI"
        />
      </Head>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
        onReady={() => {
          google.accounts.id.initialize({
            client_id:
              process.env.NEXT_PUBLIC_MANAGEMENT_CENTER_CLIENT_ID,
            callback: saveToken
          });

          const token = sessionStorage.getItem('center-token');

          if (!token) {
            google.accounts.id.renderButton(
              document.getElementById('buttonDiv'),
              {
                theme: 'filled_blue',
                size: 'large',
                text: 'continue_with',
                shape: 'pill',
                width: '150',
                select_by: 'auto'
              }
            );

            google.accounts.id.prompt();
          }
        }}
      />

      <Grid container>
        <CssBaseline />
        <MainHeader drawerWidth={drawerWidth} setMobileOpen={setMobileOpen} />
        <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <Box
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          {props.children}
        </Box>

      </Grid>
    </>
  );
};

export default MainLayout;
