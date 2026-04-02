'use client';

/**
 * breadcrumb-mui-T06: Match custom separator style (MUI)
 * 
 * Target sample shows: Home / Products / Item (slash separator)
 * Three options with different separators.
 * Click the matching one (slash separator).
 */

import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Card, CardContent, CardHeader, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    if (id === 'slash') {
      onSuccess();
    }
  };

  const BreadcrumbOption = ({
    separator,
    id,
  }: {
    separator: React.ReactNode;
    id: string;
  }) => (
    <Box
      onClick={() => handleSelect(id)}
      data-testid={`mui-breadcrumb-${id}-sep`}
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: selected === id ? '2px solid #1976d2' : '1px solid #ddd',
        cursor: 'pointer',
        mb: 1,
        bgcolor: selected === id ? '#e3f2fd' : '#fff',
      }}
    >
      <Breadcrumbs separator={separator}>
        <Typography>Home</Typography>
        <Typography>Products</Typography>
        <Typography>Item</Typography>
      </Breadcrumbs>
    </Box>
  );

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Separator Match" />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Target sample:
          </Typography>
          <Box
            data-testid="mui-target-separator"
            sx={{
              p: 1.5,
              bgcolor: '#e3f2fd',
              borderRadius: 1,
              border: '2px solid #1976d2',
            }}
          >
            <Breadcrumbs separator="/">
              <Typography>Home</Typography>
              <Typography>Products</Typography>
              <Typography>Item</Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Click the matching breadcrumb:
        </Typography>

        <BreadcrumbOption separator={<NavigateNextIcon fontSize="small" />} id="chevron" />
        <BreadcrumbOption separator="/" id="slash" />
        <BreadcrumbOption separator="-" id="dash" />

        {selected && (
          <Typography
            sx={{
              color: selected === 'slash' ? 'success.main' : 'error.main',
              fontWeight: 500,
              mt: 2,
            }}
          >
            {selected === 'slash' ? 'Correct match!' : 'Incorrect selection'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
