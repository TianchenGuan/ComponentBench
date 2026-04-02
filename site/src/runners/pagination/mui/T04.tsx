'use client';

/**
 * pagination-mui-T04: Navigate to last page
 * 
 * Centered isolated card titled "Transactions".
 * MUI Pagination with first/last buttons.
 * Currently on page 3 of 20. Goal is to click last page button.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, List, ListItem, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample transactions
const transactions = Array.from({ length: 200 }, (_, i) => ({
  id: `TXN-${String(i + 1).padStart(5, '0')}`,
  amount: `${Math.random() > 0.5 ? '+' : '-'}$${(Math.random() * 200).toFixed(2)}`,
  date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
}));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(3); // Start at page 3
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 20 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedTransactions = transactions.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Transactions
        </Typography>
        <List dense sx={{ maxHeight: 180, overflow: 'auto', mb: 2 }}>
          {paginatedTransactions.map((txn) => (
            <ListItem key={txn.id}>
              <ListItemText 
                primary={txn.id} 
                secondary={`${txn.amount} - ${txn.date}`} 
              />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of 20
          </Typography>
          <Pagination
            count={20}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            data-testid="mui-pagination-transactions"
          />
        </div>
      </CardContent>
    </Card>
  );
}
