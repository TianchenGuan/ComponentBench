'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, Button, Menu, MenuItem, ListItemIcon, ListItemText, Snackbar, Alert, Box, Typography } from '@mui/material';
import { Download, BarChart, TableChart, Code } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('metrics-chart.json', '{"data": []}');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleMenuItemClick = (item: string) => {
    setAnchorEl(null);
    if (item === 'B' && !completed) {
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  const patternA = { background: 'linear-gradient(45deg, #ff6b6b, #feca57)', width: 24, height: 24, borderRadius: 4, mr: 1 };
  const patternB = { background: 'linear-gradient(135deg, #48dbfb, #ff9ff3)', width: 24, height: 24, borderRadius: 4, mr: 1 };
  const patternC = { background: 'linear-gradient(90deg, #52c41a, #faad14)', width: 24, height: 24, borderRadius: 4, mr: 1 };
  const referencePattern = patternB;

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Charts" subheader={<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><Box sx={referencePattern} /><Typography variant="caption">Reference preview</Typography></Box>} />
      <CardContent>
        <Button variant="outlined" startIcon={<Download />} onClick={(e) => setAnchorEl(e.currentTarget)} data-testid="download-menu">
          Download
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleMenuItemClick('A')}><Box sx={patternA} /><ListItemText>Chart export A</ListItemText></MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('B')} data-testid="chart-export-b"><Box sx={patternB} /><ListItemText>Chart export B</ListItemText></MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('C')}><Box sx={patternC} /><ListItemText>Chart export C</ListItemText></MenuItem>
        </Menu>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">Download started: metrics-chart.json</Alert>
      </Snackbar>
    </Card>
  );
}
