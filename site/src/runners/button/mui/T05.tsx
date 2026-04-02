'use client';

/**
 * button-mui-T05: Match the outlined-with-icon button (visual reference)
 * 
 * Card titled "Find the matching button" with target sample showing outlined + start icon.
 * Four Export buttons with different variants and icon placements.
 * Task: Click the outlined button with start icon.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (buttonId: string) => {
    setSelected(buttonId);
    if (buttonId === 'outlined-start') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Find the matching button</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">Target sample:</Typography>
            <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />} data-reference-id="mui-target-outlined-starticon">
              Export
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click the button that matches the Target sample shown above.
        </Typography>
        
        <Stack spacing={1}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleClick('contained-start')}
            data-testid="mui-btn-export-contained-start"
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleClick('outlined-start')}
            data-testid="mui-btn-export-outlined-start"
          >
            Export
          </Button>
          <Button
            variant="outlined"
            endIcon={<FileDownloadIcon />}
            onClick={() => handleClick('outlined-end')}
            data-testid="mui-btn-export-outlined-end"
          >
            Export
          </Button>
          <Button
            variant="text"
            onClick={() => handleClick('text-none')}
            data-testid="mui-btn-export-text"
          >
            Export
          </Button>
        </Stack>
        
        {selected && (
          <Typography sx={{ mt: 2 }} color={selected === 'outlined-start' ? 'success.main' : 'error.main'}>
            Selected option recorded
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
