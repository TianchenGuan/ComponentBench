'use client';

/**
 * toggle_button_group_multi-mui-T11: Text styles selection
 *
 * Layout: isolated_card centered in the viewport.
 *
 * A single card titled "Text styles" contains a Material UI ToggleButtonGroup 
 * configured for multiple selection (exclusive=false). The group displays four toggle buttons:
 * - Bold
 * - Italic
 * - Underline
 * - Strikethrough
 *
 * Initial state:
 * - No buttons are selected.
 *
 * Selected buttons show MUI's selected styling (background change) and are also 
 * announced via aria-pressed=true on the underlying buttons.
 *
 * No Apply/Save step and no additional clutter.
 *
 * Success: Selected options equal exactly: Bold, Underline
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import type { TaskComponentProps } from '../types';

const TARGET_SET = new Set(['Bold', 'Underline']);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

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
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Text styles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select Bold and Underline.
        </Typography>

        <ToggleButtonGroup
          value={selected}
          onChange={handleChange}
          aria-label="text formatting"
          data-testid="text-styles-group"
        >
          <ToggleButton value="Bold" aria-label="Bold" data-testid="style-bold">
            <FormatBoldIcon sx={{ mr: 0.5 }} />
            Bold
          </ToggleButton>
          <ToggleButton value="Italic" aria-label="Italic" data-testid="style-italic">
            <FormatItalicIcon sx={{ mr: 0.5 }} />
            Italic
          </ToggleButton>
          <ToggleButton value="Underline" aria-label="Underline" data-testid="style-underline">
            <FormatUnderlinedIcon sx={{ mr: 0.5 }} />
            Underline
          </ToggleButton>
          <ToggleButton value="Strikethrough" aria-label="Strikethrough" data-testid="style-strikethrough">
            <StrikethroughSIcon sx={{ mr: 0.5 }} />
            Strikethrough
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
