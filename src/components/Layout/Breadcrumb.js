import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  AppBar,
  Grid,
  ListItemIcon,
  Box,
  CardMedia
} from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Link from 'next/link';

const BreadCrumb = () => {
  const [active, setActive] = useState(true);

  const router = useRouter();
  const { pathname } = router;

  const segments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbLinks = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;

    const changeTitle = (segment) => {
      switch (segment) {
        case 'planner':
          return 'Planificacion Estratégica';
        case 'collaborator':
          return 'Colaborador';
        case 'collaborators':
          return 'Colaboradores';
        case 'new-collaborator':
          return 'Nuevo Colaborador';
        case 'create-collaborator-steps':
          return 'Agregar nuevo colaborador';
        case 'collaborator-information':
          return 'Informacion personal';
      }
    };

    return (
      <Typography
        key={path}
        variant="subtitle1"
        className="path"
        color={active ? 'inherit' : 'primary'}
      >
        {changeTitle(segment)}
      </Typography>
    );
  });

  function LinkRouter(props) {
    return <MuiLink {...props} component={Link} />;
  }

  function displayIcon(goBack) {
    return !goBack && <ArrowCircleLeftOutlinedIcon />;
  }

  useEffect(() => {
    segments.length == 0 ? setActive(true) : setActive(false);
  }, [segments.length, active]);

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{ p: 1, marginBottom: 1, paddingTop: 1, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Grid container>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CardMedia
            sx={{
              width: 120,
              height: 30,
              margin: 0.5
            }}
            image="consultec_logo_name.png"
          />
        </Box>
        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            data-testid="goBack-button"
            onClick={() => {
              router.back();
            }}
          >
            {displayIcon(segments.length == 0 ? 'true' : null)}
          </ListItemIcon>
        </Grid>
        <Grid sx={{ p: 2, marginBottom: 1, paddingTop: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography variant="subtitle1">
              <LinkRouter underline="none" color={active ? 'primary' : 'inherit'} href="/">
                Menú principal
              </LinkRouter>
            </Typography>
            {breadcrumbLinks}
          </Breadcrumbs>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default BreadCrumb;
