import { Box, CssBaseline, Grid } from '@mui/material';
import Head from 'next/head';

import useAuth from '../hooks/useAuth';

import { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';

const drawerWidth = 240;

const MainLayout = (props) => {
  const { userToken, waitingUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        {!waitingUser && userToken ? (
          <>
            <Sidebar
              drawerWidth={drawerWidth}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
            <Box
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' }
              }}
            >
              {props.children}
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
