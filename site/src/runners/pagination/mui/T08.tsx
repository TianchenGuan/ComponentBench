'use client';

/**
 * pagination-mui-T08: Small pagination in bottom-right
 * 
 * Dashboard layout with small pagination.
 * MUI Pagination with size="small".
 * Currently on page 2 of 10. Goal is to reach page 6.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, Box, Grid } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample gallery items
const images = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Image ${i + 1}`,
}));

export default function T08({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(2); // Start at page 2
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 6 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedImages = images.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Box sx={{ width: 350 }}>
      <Typography variant="subtitle2" gutterBottom>
        Image Gallery
      </Typography>
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ p: 1 }}>
          <Grid container spacing={0.5}>
            {paginatedImages.slice(0, 6).map((img) => (
              <Grid item xs={4} key={img.id}>
                <Box
                  sx={{
                    height: 40,
                    bgcolor: 'grey.200',
                    borderRadius: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                  }}
                >
                  {img.title}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          count={10}
          page={currentPage}
          onChange={handlePageChange}
          size="small"
          color="primary"
          data-testid="mui-pagination-gallery"
        />
      </Box>
    </Box>
  );
}
