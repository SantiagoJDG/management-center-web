import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

const columns = [
  { id: 'name', label: 'Nombre', minWidth: 170 },
  {
    id: 'rollon',
    label: 'Fecha de Ingreso',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'country_residency',
    label: 'Pais de Residencia',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'country_contract',
    label: 'Pais de Contrato',
    minWidth: 170,
    align: 'right'
  },
  ,
  {
    id: 'salary',
    label: 'Tarifa mensual bruta',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'supervisor',
    label: 'Supervisor',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'contract_type',
    label: 'N1 Perfil',
    minWidth: 170,
    align: 'right'
  }
];

const CollaboratorTable = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  if (props.collaborators.length < 1) {
    return 'There are not collaborator';
  } else {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.collaborators
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={props.collaborators.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
};

export default CollaboratorTable;
