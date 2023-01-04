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
import { useRouter } from 'next/router';

const columns = [
  { id: 'name', label: 'Nombre y apellidos', minWidth: 170, align: 'center' },
  {
    id: 'admission_date',
    label: 'Fecha de Ingreso',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'residency',
    label: 'País de Residencia',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'office',
    label: 'País de Contrato',
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
  },
  {
    id: 'profile',
    label: 'N1-Profile',
    minWidth: 170,
    align: 'center'
  }
];

const CollaboratorTable = ({ collaborators }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const router = useRouter();

  const handleRowClick = (id) => {
    router.push({
      pathname: '/collaborator',
      query: { id: id }
    });
  };

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
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      onClick={() => handleRowClick(row.collaboratorid)}
                    >
                      {columns.map((column) => {
                        var value = row[column.id];
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
