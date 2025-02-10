import { useEffect } from 'react';

import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';

import useAuth from 'hooks/useAuth';

export default function Home() {
  const { userToken, waitingUser } = useAuth();

  const router = useRouter();

  const pagesList = [
    {
      name: 'Agregar nuevo colaborador',
      path: '/create-collaborator-steps',
      view: ['administrador']
    },
    {
      name: 'Lista Consultores',
      path: '/collaborators',
      view: ['administrador']
    },
    {
      name: 'Planificacion Estratégica',
      path: '/planner',
      view: ['administrador']
    }
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
      case '/create-collaborator':
        return (
          <ListItemIcon>
            <PersonIcon />
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
    const collaboratorId = sessionStorage.getItem('collaboratorId');
    const collaboratorInfo = sessionStorage.getItem('personal');
    if (collaboratorId) sessionStorage.removeItem('collaboratorId');
    if (collaboratorInfo) sessionStorage.removeItem('personal');
  }, [userToken, waitingUser]);

  return (
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
}
