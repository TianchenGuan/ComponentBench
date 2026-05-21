'use client';

/**
 * pagination-mui-T03: Navigate to first page using first-page button
 * 
 * Form section titled "Order History".
 * MUI Pagination with showFirstButton and showLastButton.
 * Currently on page 5 of 10. Goal is to click first page button.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, List, ListItem, ListItemText, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample orders
const orders = Array.from({ length: 100 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, '0')}`,
  date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
  total: `$${(Math.random() * 500 + 50).toFixed(2)}`,
}));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(5); // Start at page 5
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 1 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedOrders = orders.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Box sx={{ width: 500 }}>
      <Typography variant="h5" gutterBottom>
        Order History
      </Typography>
      <Card>
        <CardContent>
          <List dense sx={{ maxHeight: 180, overflow: 'auto', mb: 2 }}>
            {paginatedOrders.map((order) => (
              <ListItem key={order.id}>
                <ListItemText 
                  primary={order.id} 
                  secondary={`${order.date} - ${order.total}`} 
                />
              </ListItem>
            ))}
          </List>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of 10
            </Typography>
            <Pagination
              count={10}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              data-testid="mui-pagination-orders"
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
