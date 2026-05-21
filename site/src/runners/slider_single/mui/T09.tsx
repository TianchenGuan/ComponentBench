'use client';

/**
 * slider_single-mui-T09: Scroll to Advanced section and set Smoothing to 7 (dark form)
 * 
 * Layout: long form_section page in dark theme (dark background, light text), requiring vertical scrolling.
 * The page is split into sections (Basic, Color, Advanced) with headings and various non-required controls (text fields, checkboxes, dropdowns).
 * Three sliders appear across the page: "Sharpening", "Contrast", and "Smoothing" (TARGET). Only Smoothing is in the Advanced section near the bottom.
 * Slider configuration: Smoothing uses a Material UI Slider with range 0–10, step=1; valueLabelDisplay='auto' shows a value bubble while dragging.
 * Initial state: Smoothing starts at 3.
 * Clutter is high: there are multiple inputs and helper texts around; however, only the slider value affects success and there is no Apply/Cancel step.
 * 
 * Success: The 'Smoothing' slider value equals 7. The correct instance is required: only the slider labeled 'Smoothing' counts.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  ThemeProvider,
  createTheme,
  Paper,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T09({ onSuccess }: TaskComponentProps) {
  const [sharpening, setSharpening] = useState(5);
  const [contrast, setContrast] = useState(4);
  const [smoothing, setSmoothing] = useState(3);

  useEffect(() => {
    if (smoothing === 7) {
      onSuccess();
    }
  }, [smoothing, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper sx={{ width: 500, p: 3, minHeight: 1200, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>
          Image settings
        </Typography>

        {/* Basic Section */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Basic
        </Typography>
        <TextField
          fullWidth
          label="Image name"
          defaultValue="untitled.jpg"
          size="small"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Auto-enhance"
        />
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel>Format</InputLabel>
          <Select defaultValue="jpg" label="Format">
            <MenuItem value="jpg">JPEG</MenuItem>
            <MenuItem value="png">PNG</MenuItem>
            <MenuItem value="webp">WebP</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
          Sharpening
        </Typography>
        <Slider
          value={sharpening}
          onChange={(_, v) => setSharpening(v as number)}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
          data-testid="slider-sharpening"
        />
        <Typography variant="body2" color="text.secondary">
          Current: {sharpening}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Color Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Color
        </Typography>
        <FormControlLabel
          control={<Checkbox />}
          label="Convert to grayscale"
        />
        <TextField
          fullWidth
          label="Saturation"
          defaultValue="100"
          size="small"
          sx={{ mt: 2, mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
          Contrast
        </Typography>
        <Slider
          value={contrast}
          onChange={(_, v) => setContrast(v as number)}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
          data-testid="slider-contrast"
        />
        <Typography variant="body2" color="text.secondary">
          Current: {contrast}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Spacer */}
        <Box sx={{ height: 200 }} />

        {/* Advanced Section - TARGET */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Advanced
        </Typography>
        <FormControlLabel
          control={<Checkbox />}
          label="Enable GPU acceleration"
        />
        <TextField
          fullWidth
          label="Custom parameters"
          defaultValue=""
          size="small"
          sx={{ mt: 2, mb: 2 }}
          helperText="Optional: enter custom processing parameters"
        />

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
          Smoothing
        </Typography>
        <Slider
          value={smoothing}
          onChange={(_, v) => setSmoothing(v as number)}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
          data-testid="slider-smoothing"
        />
        <Typography variant="body2" color="text.secondary">
          Current: {smoothing}
        </Typography>
      </Paper>
    </ThemeProvider>
  );
}
