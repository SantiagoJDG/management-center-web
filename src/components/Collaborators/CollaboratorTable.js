import * as React from 'react';
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
  Box
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (firstCollab, nextCollab, orderBy) => {
    if (nextCollab[orderBy] < firstCollab[orderBy]) {
      return -1;
    }
    if (nextCollab[orderBy] > firstCollab[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (firstCollab, nextCollab) => descendingComparator(firstCollab, nextCollab, orderBy)
      : (fisrtCollab, nextCollab) => -descendingComparator(fisrtCollab, nextCollab, orderBy);
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

  if (collaborators.length < 1) {
    return 'There are not collaborator';
  } else {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {stableSort(collaborators, getComparator(order, orderBy))
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
const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ minWidth: headCell.minWidth, background: 'grey' }}
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
        ))}
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
