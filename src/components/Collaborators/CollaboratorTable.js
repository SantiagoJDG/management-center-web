import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Box,
  Menu,
  MenuItem
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useRouter } from 'next/router';

const CollaboratorTable = ({ collaborators }) => {
  const columns = [
    { id: 'name', label: 'Nombre y apellidos', minWidth: 170, align: 'center' },
    {
      id: 'admissionDate',
      label: 'Fecha de Ingreso',
      minWidth: 170,
      align: 'center'
    },
    {
      id: `residencyData.countryData.name`,
      label: 'País de Residencia',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'officeData.name',
      label: 'País de Contrato',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'salaries[0].amount',
      label: 'Tarifa mensual bruta',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'supervisorData.name',
      label: 'Supervisor',
      minWidth: 170,
      align: 'center'
    }
  ];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const [selectedCollaboratorMenu, setSelectedCollaboratorMenu] = useState(null);

  const router = useRouter();

  const openMenu = Boolean(menuAnchorElement);

  const handleOpenMenuByCollaborator = (event, collaboratorId) => {
    setMenuAnchorElement(event.currentTarget);
    setSelectedCollaboratorMenu(collaboratorId);
  };

  const handleCloseMenu = () => {
    setMenuAnchorElement(null);
    setSelectedCollaboratorMenu(null);
  };

  const handleProfileRouting = (edit) => {
    let queryParams = { id: selectedCollaboratorMenu };

    if (edit === true) {
      queryParams = { ...queryParams, edit };
    }

    router.push({
      pathname: '/collaborator',
      query: queryParams
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (firstCollab, nextCollab, orderBy) => {
    if (Object.byString(nextCollab, orderBy) < Object.byString(firstCollab, orderBy)) {
      return -1;
    }
    if (Object.byString(nextCollab, orderBy) > Object.byString(firstCollab, orderBy)) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (firstCollab, nextCollab) => descendingComparator(firstCollab, nextCollab, orderBy)
      : (fisrtCollab, nextCollab) => -descendingComparator(fisrtCollab, nextCollab, orderBy);
  };

  Object.byString = function (row, accessProperty) {
    var accessPropertyReplaced = accessProperty.replace(/\[(\w+)\]/g, '.$1');
    var accessPropertyNew = accessPropertyReplaced.replace(/^\./, '');
    var accessPropertySplitted = accessPropertyNew.split('.');
    for (var i = 0, n = accessPropertySplitted.length; i < n; ++i) {
      var eachProperty = accessPropertySplitted[i];
      if (eachProperty in row) {
        row = row[eachProperty];
      } else {
        return;
      }
    }
    return row;
  };

  const stableSort = (collaborators, comparator) => {
    const stabilizedThis = collaborators.map((collaborator, index) => [collaborator, index]);
    stabilizedThis.sort((firstCollab, nextCollab) => {
      const order = comparator(firstCollab[0], nextCollab[0]);
      if (order !== 0) {
        return order;
      }
      return firstCollab[1] - nextCollab[1];
    });
    return stabilizedThis.map((collaborator) => collaborator[0]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table" sx={{ maxHeight: 440 }}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {stableSort(collaborators, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((collaborator, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      onClick={(event) => handleOpenMenuByCollaborator(event, collaborator.id)}
                    >
                      {columns.map((column) => {
                        let value = Object.byString(collaborator, column.id);
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell key={collaborator.id} align="center">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {/*{collaborator.profiles.map((value, index) => (
                            <Chip key={index} label={value.name} />
                           ))}*/}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={collaborators.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        id="optionsMenu"
        anchorEl={menuAnchorElement}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={handleProfileRouting}>Ver Perfil</MenuItem>
        <MenuItem onClick={() => handleProfileRouting(true)}>Editar</MenuItem>
      </Menu>
    </Box>
  );
};

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const columnsHeader = [
    { id: 'name', label: 'Nombre y apellidos', minWidth: 170, align: 'center' },
    {
      id: 'admissionDate',
      label: 'Fecha de Ingreso',
      minWidth: 170,
      align: 'center'
    },
    {
      id: `residencyData.countryData.name`,
      label: 'País de Residencia',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'officeData.name',
      label: 'País de Contrato',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'salaries[0].amount',
      label: 'Tarifa mensual bruta',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'supervisorData.name',
      label: 'Supervisor',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'profiles',
      label: 'N1-Profile',
      minWidth: 170,
      align: 'center'
    }
  ];

  return (
    <TableHead>
      <TableRow>
        {columnsHeader.map((headCell) => {
          return (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ minWidth: headCell.minWidth, background: '#5eaae7', color: 'white' }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

export default CollaboratorTable;
