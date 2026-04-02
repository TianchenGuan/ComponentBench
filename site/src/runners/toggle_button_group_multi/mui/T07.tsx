'use client';

/**
 * toggle_button_group_multi-mui-T17: Small vertical report sections
 *
 * Layout: isolated_card anchored near the bottom-left of the viewport (placement=bottom_left).
 *
 * A single compact card titled "Report sections" contains a MUI ToggleButtonGroup 
 * configured for multiple selection. The group is:
 * - Orientation: vertical (buttons stacked)
 * - Size: small (reduced padding)
 *
 * Options (top to bottom):
 * - Summary
 * - Charts
 * - Tables
 * - Notes
 * - Attachments
 * - Footer
 *
 * Initial state:
 * - Summary and Footer are selected.
 * - All other sections are unselected.
 *
 * No Apply/Save button; selection updates immediately. No other UI elements are present.
 *
 * Success: Selected options equal exactly: Charts, Tables, Attachments
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TaskComponentProps } from '../types';

const SECTIONS = ['Summary', 'Charts', 'Tables', 'Notes', 'Attachments', 'Footer'];
const TARGET_SET = new Set(['Charts', 'Tables', 'Attachments']);

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Summary', 'Footer']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSelected(newFormats);
  };

  return (
    <Card sx={{ width: 200 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontSize: 14 }}>
          Report sections
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 11 }}>
          Select Charts, Tables, Attachments.
        </Typography>

        <ToggleButtonGroup
          value={selected}
          onChange={handleChange}
          orientation="vertical"
          size="small"
          aria-label="report sections"
          sx={{ width: '100%' }}
          data-testid="report-sections-group"
        >
          {SECTIONS.map(section => (
            <ToggleButton 
              key={section} 
              value={section} 
              aria-label={section}
              sx={{ justifyContent: 'flex-start', fontSize: 12, py: 0.5 }}
              data-testid={`section-${section.toLowerCase()}`}
            >
              {section}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
