import { Alert, Box, CssBaseline, Grid, Snackbar } from '@mui/material';
import Head from 'next/head';

import useAuth from 'hooks/useAuth';
import useMessage from 'hooks/useMessage';
import Sidebar from 'components/Layout/Sidebar';
import BreadCrumb from 'components/Layout/Breadcrumb';
import { useState } from 'react';

const drawerWidth = 100;

const MainLayout = (props) => {
  const { userToken, waitingUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openMessage, message, handleCloseMessage } = useMessage();

  return (
    <>
      <Head>
        <title>Management Center</title>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon-apple.png" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Management center was created by Consultec-TI" />
      </Head>

      <Grid container>
        <CssBaseline />

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openMessage}
          Duration={5000}
          onClose={handleCloseMessage}
        >
          <Alert severity={message.severity}>{message.text}</Alert>
        </Snackbar>
        {!waitingUser && userToken ? (
          <>
            <BreadCrumb />
            <Sidebar
              drawerWidth={drawerWidth}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
            <Box
              sx={{
                flexGrow: 1,
                width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
                backgroundImage: "url('/background-02-hires.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
                minHeight: '100vh',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  p: 3
                }}
              >
                {props.children}
              </Box>
            </Box>
          </>
        ) : (
          <>{props.children}</>
        )}
      </Grid>
    </>
  );
};

export default MainLayout;
