'use client';

/**
 * toolbar-mui-T02: Enable Bold in ToggleButtonGroup toolbar
 *
 * A centered isolated card contains a MUI Toolbar (Paper background) labeled "Formatting". 
 * Inside it is a ToggleButtonGroup configured for multiple selection with three ToggleButtons: 
 * "Bold", "Italic", and "Underline".
 * Each ToggleButton shows an icon and a text label. Selected buttons have aria-pressed=true.
 * A small status readout under the toolbar shows the current state (e.g., "Bold: Off").
 */

import React, { useState } from 'react';
import {
  Paper,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [formats, setFormats] = useState<string[]>([]);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
    if (newFormats.includes('bold')) {
      onSuccess();
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 400, p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Formatting
      </Typography>
      <Toolbar
        variant="dense"
        sx={{ bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}
        data-testid="mui-toolbar-formatting"
      >
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton
            value="bold"
            aria-label="bold"
            aria-pressed={formats.includes('bold')}
            data-testid="mui-toolbar-formatting-bold"
          >
            <FormatBoldIcon sx={{ mr: 0.5 }} />
            Bold
          </ToggleButton>
          <ToggleButton
            value="italic"
            aria-label="italic"
            aria-pressed={formats.includes('italic')}
            data-testid="mui-toolbar-formatting-italic"
          >
            <FormatItalicIcon sx={{ mr: 0.5 }} />
            Italic
          </ToggleButton>
          <ToggleButton
            value="underline"
            aria-label="underline"
            aria-pressed={formats.includes('underline')}
            data-testid="mui-toolbar-formatting-underline"
          >
            <FormatUnderlinedIcon sx={{ mr: 0.5 }} />
            Underline
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>

      <Box
        sx={{
          p: 1,
          bgcolor: 'grey.50',
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: formats.includes('bold') ? 'bold' : 'normal',
            fontStyle: formats.includes('italic') ? 'italic' : 'normal',
            textDecoration: formats.includes('underline') ? 'underline' : 'none',
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Bold: {formats.includes('bold') ? 'On' : 'Off'}
      </Typography>
    </Paper>
  );
}
