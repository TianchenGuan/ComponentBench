'use client';

/**
 * number_input_spinbutton-mui-T06: Scroll to set autosave interval
 * 
 * The page is a tall settings panel with multiple collapsible sections (General, Editor, Shortcuts, Advanced).
 * The "Editor" section is below the fold and requires scrolling to bring into view.
 * Inside "Editor", the target is a Material UI TextField labeled "Auto-save interval (minutes)" using input type='number'.
 * - Constraints: min=1, max=30, step=1.
 * - Initial state: value is 5.
 * Medium clutter: several toggles (e.g., "Format on save"), a dropdown for theme, and a multiline text area appear in other sections but do not affect success.
 * No Save/Apply button exists.
 * 
 * Success: The numeric value of the target number input is 3.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, TextField, Typography, Switch, FormControlLabel, 
  Select, MenuItem, FormControl, InputLabel, Divider, Box 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [autoSaveInterval, setAutoSaveInterval] = useState<string>('5');

  useEffect(() => {
    const numValue = parseInt(autoSaveInterval, 10);
    if (numValue === 3) {
      onSuccess();
    }
  }, [autoSaveInterval, onSuccess]);

  return (
    <Card sx={{ width: 450, maxHeight: 400, overflow: 'hidden' }}>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
          Settings
        </Typography>
        <Box sx={{ height: 340, overflowY: 'auto', px: 2 }}>
          {/* General Section */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>General</Typography>
          <FormControlLabel 
            control={<Switch defaultChecked />} 
            label="Show line numbers"
          />
          <FormControlLabel 
            control={<Switch />} 
            label="Word wrap"
          />
          <FormControl fullWidth size="small" sx={{ my: 1 }}>
            <InputLabel>Language</InputLabel>
            <Select defaultValue="en" label="Language">
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
          </FormControl>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Editor Section */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Editor</Typography>
          <FormControlLabel 
            control={<Switch defaultChecked />} 
            label="Format on save"
          />
          <FormControl fullWidth size="small" sx={{ my: 1 }}>
            <InputLabel>Theme</InputLabel>
            <Select defaultValue="dark" label="Theme">
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="monokai">Monokai</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Auto-save interval (minutes)"
            type="number"
            size="small"
            fullWidth
            value={autoSaveInterval}
            onChange={(e) => setAutoSaveInterval(e.target.value)}
            inputProps={{ 
              min: 1, 
              max: 30, 
              step: 1,
              'data-testid': 'autosave-interval-input'
            }}
            sx={{ my: 1 }}
          />
          
          <Divider sx={{ my: 2 }} />
          
          {/* Shortcuts Section */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Shortcuts</Typography>
          <FormControlLabel 
            control={<Switch defaultChecked />} 
            label="Enable keyboard shortcuts"
          />
          <FormControlLabel 
            control={<Switch />} 
            label="Vim mode"
          />
          
          <Divider sx={{ my: 2 }} />
          
          {/* Advanced Section */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Advanced</Typography>
          <TextField
            label="Custom CSS"
            multiline
            rows={3}
            fullWidth
            size="small"
            placeholder="/* Your custom styles */"
            sx={{ mb: 2 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
