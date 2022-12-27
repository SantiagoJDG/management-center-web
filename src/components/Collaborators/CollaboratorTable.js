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
  { id: 'name', label: 'Nombre', minWidth: 170, align: 'center' },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'admission_date',
    label: 'Fecha de Ingreso',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'residency',
    label: 'Pais de Residencia',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'office',
    label: 'Pais de Contrato',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'salary',
    label: 'Tarifa mensual bruta',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'supervisor',
    label: 'Supervisor',
    minWidth: 170,
    align: 'center'
  }
];

const CollaboratorTable = ({ collaborators }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  if (collaborators.length < 1) {
    return 'There are not collaborator';
  } else {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align}
                    style={{ minWidth: column.minWidth, background: 'grey' }}
                  >
                    <b> {column.label}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {collaborators
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
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
          count={collaborators.length}
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
