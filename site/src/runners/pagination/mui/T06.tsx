'use client';

/**
 * pagination-mui-T06: Navigate to page 5 in compact table
 * 
 * Table cell layout with compact inventory table.
 * MUI TablePagination below the table.
 * Currently on page 1. Need to reach page 5 (showing items 41-50).
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
  Paper
} from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample inventory
const inventory = Array.from({ length: 100 }, (_, i) => ({
  id: `SKU-${String(i + 1).padStart(4, '0')}`,
  name: `Product ${i + 1}`,
  stock: Math.floor(Math.random() * 100),
  price: `$${(Math.random() * 100).toFixed(2)}`,
}));

export default function T06({ onSuccess }: TaskComponentProps) {
  const [page, setPage] = useState(0); // MUI TablePagination is 0-indexed
  const [completed, setCompleted] = useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    // Page 5 is index 4 (0-indexed)
    if (newPage === 4 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedInventory = inventory.slice(page * 10, page * 10 + 10);

  return (
    <Card sx={{ width: 550 }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ px: 1 }}>
          Inventory
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.stock}</TableCell>
                  <TableCell align="right">{item.price}</TableCell>
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
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          data-testid="mui-tablepagination-inventory"
        />
      </CardContent>
    </Card>
  );
}
