'use client';

/**
 * pagination-mui-T07: Change rows per page in table
 * 
 * Form section layout with data grid.
 * MUI TablePagination with rows per page selector.
 * Currently showing 10 rows per page. Goal is to select 25.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Paper,
  Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample data
const data = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Record ${i + 1}`,
  value: Math.floor(Math.random() * 1000),
  category: ['Alpha', 'Beta', 'Gamma'][i % 3],
}));

export default function T07({ onSuccess }: TaskComponentProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [completed, setCompleted] = useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (newRowsPerPage === 25 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: 550 }}>
      <Typography variant="h5" gutterBottom>
        Data Grid
      </Typography>
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.value}</TableCell>
                    <TableCell>{item.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            data-testid="mui-tablepagination-grid"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
