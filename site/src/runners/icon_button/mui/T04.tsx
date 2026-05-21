'use client';

/**
 * icon_button-mui-T04: Expand Advanced filters (top-right disclosure)
 *
 * Layout: isolated_card with the target anchored at the top-right.
 * A card titled "Filters" contains a section header "Advanced filters" with 
 * an expand icon button on the far right.
 * 
 * Success: The expand IconButton has aria-expanded="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !expanded;
    setExpanded(newState);
    if (newState) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        {/* Static filter summaries */}
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          <Typography variant="body2">Status: Any</Typography>
          <Typography variant="body2">Owner: Anyone</Typography>
        </Box>

        {/* Advanced filters section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderTop: 1,
            borderColor: 'divider',
            pt: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2">Advanced filters</Typography>
            <Chip 
              label={expanded ? 'Expanded' : 'Collapsed'} 
              size="small" 
              color={expanded ? 'success' : 'default'}
              sx={{ fontSize: 10, height: 20 }}
            />
          </Box>
          <IconButton
            onClick={handleToggle}
            aria-label="Expand advanced filters"
            aria-expanded={expanded}
            data-testid="mui-icon-btn-expand"
            size="small"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2">Date range: Last 30 days</Typography>
            <Typography variant="body2">Priority: All</Typography>
            <Typography variant="body2">Tags: None selected</Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
