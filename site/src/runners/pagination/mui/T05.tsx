'use client';

/**
 * pagination-mui-T05: Navigate in dark theme settings
 * 
 * Dark theme settings panel titled "Change History".
 * MUI Pagination at bottom, pages 1-6.
 * Currently on page 1. Goal is to click page 4.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, List, ListItem, ListItemText, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample change history
const changes = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  action: i % 3 === 0 ? 'Created' : i % 3 === 1 ? 'Updated' : 'Deleted',
  item: `Setting ${i + 1}`,
  timestamp: `${String((i % 24)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
}));

export default function T05({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 4 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedChanges = changes.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Box sx={{ width: 500 }}>
      <Typography variant="h5" gutterBottom>
        Change History
      </Typography>
      <Card>
        <CardContent>
          <List dense sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
            {paginatedChanges.map((change) => (
              <ListItem key={change.id}>
                <ListItemText 
                  primary={`${change.action}: ${change.item}`} 
                  secondary={change.timestamp} 
                />
              </ListItem>
            ))}
          </List>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of 6
            </Typography>
            <Pagination
              count={6}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              data-testid="mui-pagination-history"
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
