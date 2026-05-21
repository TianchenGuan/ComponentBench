'use client';

/**
 * pagination-mui-T10: Navigate in modal dialog
 * 
 * Modal flow layout with MUI Dialog already open.
 * Dialog title: "Search Results".
 * Currently on page 1 of 5. Goal is to click page 3.
 */

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Pagination, 
  List, 
  ListItem, 
  ListItemText,
  Typography
} from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample search results
const results = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Result ${i + 1}`,
  description: `Description for result ${i + 1}`,
}));

export default function T10({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 3 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedResults = results.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Dialog 
      open={true} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>Search Results</DialogTitle>
      <DialogContent>
        <List dense sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
          {paginatedResults.map((result) => (
            <ListItem key={result.id}>
              <ListItemText primary={result.title} secondary={result.description} />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of 5
          </Typography>
          <Pagination
            count={5}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            data-testid="mui-pagination-dialog"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
