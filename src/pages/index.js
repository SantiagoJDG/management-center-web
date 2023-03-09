import { useEffect } from 'react';

import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';

import useAuth from 'hooks/useAuth';

export default function Home() {
  const { userData, userToken, waitingUser } = useAuth();

  const router = useRouter();

  const pagesList = [
    { name: 'Home', path: '/', view: ['administrador'] },
    {
      name: 'Lista Consultores',
      path: '/collaborators',
      view: ['administrador']
    },
    {
      name: 'Mi Ficha',
      path: `/collaborator?id=${userData ? userData.id : ''}`,
      view: ['administrador']
    },
    {
      name: 'Planificacion Estrategica',
      path: '/planner',
      view: ['administrador']
    },
    { name: 'Nueva Ficha', path: '/new-collaborator', view: ['administrador'] }
  ];

  const getIcon = (path) => {
    switch (path) {
      case '/new-collaborator':
      case '/collaborator':
        return (
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
        );
      case '/collaborators':
        return (
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
        );

      case '/planner':
        return (
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
        );

      default:
        return (
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
        );
    }
  };

  const handleRouting = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }
  }, [userToken, waitingUser]);

  const menuOptions = (
    <>
      <List data-testid="result">
        {pagesList.map((page, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleRouting(page.path)}>
              {getIcon(page.path)}
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return <>{menuOptions}</>;
}
