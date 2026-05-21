'use client';

/**
 * pagination-mui-T01: Navigate to page 3 (direct click)
 * 
 * Centered isolated card titled "Users".
 * MUI Pagination showing pages 1-5 with page 1 active.
 * Goal is to click page 3.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, List, ListItem, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample users
const users = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

export default function T01({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 3 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedUsers = users.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <List dense sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
          {paginatedUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing page {currentPage} of 5
          </Typography>
          <Pagination
            count={5}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            data-testid="mui-pagination-users"
          />
        </div>
      </CardContent>
    </Card>
  );
}
