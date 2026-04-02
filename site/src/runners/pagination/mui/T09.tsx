'use client';

/**
 * pagination-mui-T09: Outlined pagination style
 * 
 * Centered isolated card titled "Blog Posts".
 * MUI Pagination with variant="outlined".
 * Currently on page 1 of 8. Goal is to click page 5.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Pagination, List, ListItem, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Sample blog posts
const posts = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `Blog Post ${i + 1}`,
  excerpt: `This is the excerpt for blog post ${i + 1}...`,
}));

export default function T09({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    if (page === 5 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedPosts = posts.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Blog Posts
        </Typography>
        <List dense sx={{ maxHeight: 180, overflow: 'auto', mb: 2 }}>
          {paginatedPosts.map((post) => (
            <ListItem key={post.id}>
              <ListItemText primary={post.title} secondary={post.excerpt} />
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
            variant="outlined"
            color="primary"
            data-testid="mui-pagination-blog"
          />
        </div>
      </CardContent>
    </Card>
  );
}
