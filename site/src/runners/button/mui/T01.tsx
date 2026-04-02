'use client';

/**
 * button-mui-T01: Add to cart (contained button click)
 * 
 * Baseline isolated product card titled "Canvas Backpack".
 * Single MUI contained Button labeled "Add to cart".
 * When clicked, snackbar appears and button text changes to "Added".
 */

import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Snackbar } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [clicked, setClicked] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setSnackbarOpen(true);
    onSuccess();
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Canvas Backpack
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            $79.99
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Durable canvas backpack with padded laptop compartment and multiple pockets.
          </Typography>
          <Button
            variant="contained"
            onClick={handleClick}
            disabled={clicked}
            fullWidth
            data-testid="mui-btn-add-to-cart"
          >
            {clicked ? 'Added' : 'Add to cart'}
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Added to cart"
      />
    </>
  );
}
