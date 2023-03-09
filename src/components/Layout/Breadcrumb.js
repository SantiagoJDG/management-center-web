import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Breadcrumbs, Link, Typography, AppBar, Grid, ListItemIcon } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
          return 'Planificacion Estrategica';
        case 'collaborator':
          return 'Colaborador';
        case 'collaborators':
          return 'Colaboradores';
        case 'new-collaborator':
          return 'Nuevo Colaborador';
      }
    };

    return (
      <Link key={path} href={path} underline="none" color={active ? 'primary' : 'secondary'}>
        <Typography variant="h6">{changeTitle(segment)}</Typography>
      </Link>
    );
  });

  const displayIcon = (goBack) => {
    return goBack ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />;
  };

  return (
    <AppBar position="static" color="transparent" sx={{ p: 2, marginBottom: 2 }}>
      <Grid container>
        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon onClick={() => router.back()}>
            {displayIcon(segments.length == 0 ? 'true' : null)}
          </ListItemIcon>
        </Grid>
        <Grid>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography variant="h6">
              <Link key={'/'} href={'/'} underline="none" color={active ? 'primary' : 'secondary'}>
                Menú principal
              </Link>
            </Typography>
            {breadcrumbLinks}
          </Breadcrumbs>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default BreadCrumb;
