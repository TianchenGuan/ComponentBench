'use client';

/**
 * toggle_button_group_multi-mui-T12: Clear selected contact methods
 *
 * Layout: isolated_card centered in the viewport.
 *
 * The card title is "Contact methods". It contains a horizontal MUI ToggleButtonGroup 
 * (multiple selection) with three options:
 * - Email
 * - SMS
 * - Push
 *
 * Initial state:
 * - Email, SMS, and Push are all selected.
 *
 * A small text button labeled "Clear selection" appears directly under the group 
 * (part of the same card). Clicking it sets the group value to an empty array (no selection). 
 * Users can also deselect by clicking each selected toggle.
 *
 * No modal and no other distractors (clutter=none).
 *
 * Success: Selected options equal exactly: (none selected)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Email', 'SMS', 'Push']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSelected(newFormats);
  };

  const handleClear = () => {
    setSelected([]);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contact methods
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Clear all selections.
        </Typography>

        <ToggleButtonGroup
          value={selected}
          onChange={handleChange}
          aria-label="contact methods"
          data-testid="contact-methods-group"
        >
          <ToggleButton value="Email" aria-label="Email" data-testid="method-email">
            Email
          </ToggleButton>
          <ToggleButton value="SMS" aria-label="SMS" data-testid="method-sms">
            SMS
          </ToggleButton>
          <ToggleButton value="Push" aria-label="Push" data-testid="method-push">
            Push
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ mt: 2 }}>
          <Button 
            variant="text" 
            size="small" 
            onClick={handleClear}
            data-testid="clear-selection-button"
          >
            Clear selection
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
