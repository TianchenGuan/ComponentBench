'use client';

/**
 * pagination-mui-T02: Navigate using next button
 * 
 * Centered isolated card titled "News Feed".
 * Currently on page 1 of 8. Goal is to click next arrow twice to reach page 3.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, List, ListItem, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample news items
const newsItems = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `News Article ${i + 1}`,
  summary: `Summary of article ${i + 1}...`,
}));

export default function T02({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 3 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedNews = newsItems.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          News Feed
        </Typography>
        <List dense sx={{ maxHeight: 180, overflow: 'auto', mb: 2 }}>
          {paginatedNews.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.title} secondary={item.summary} />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of 8
          </Typography>
          <Pagination
            count={8}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            data-testid="mui-pagination-news"
          />
        </div>
      </CardContent>
    </Card>
  );
}
