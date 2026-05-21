'use client';

/**
 * color_text_input-mui-T07: Set Link color in dark theme (mixed guidance) with MUI TextField
 *
 * Layout: settings_panel using MUI dark theme.
 * Component: a MUI TextField labeled 'Link color (hex)' with a preview square.
 * A small non-interactive reference swatch is shown next to the label.
 *
 * Initial state: the field contains #90caf9.
 * Clutter: nearby settings include a Switch for 'Underline links' and a Select for 'Link style'.
 *
 * Feedback: when valid, the preview square updates; helper text shows errors in a muted
 * low-contrast style typical of dark theme.
 *
 * Success: Link color parses to RGBA(100, 181, 246, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, TextField, Typography, Box, InputAdornment,
  Switch, FormControlLabel, Select, MenuItem, Stack, FormControl, InputLabel
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 100, g: 181, b: 246, a: 1 };
const TARGET_HEX = '#64b5f6';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [linkColor, setLinkColor] = useState('#90caf9');
  const [underlineLinks, setUnderlineLinks] = useState(true);
  const [linkStyle, setLinkStyle] = useState('normal');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isValid = isValidHex6(linkColor);
  const parsedColor = hexToRgba(linkColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card
      sx={{
        width: 400,
        backgroundColor: '#1e1e1e',
        color: '#fff',
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
          Link Settings
        </Typography>
        
        <Stack spacing={2}>
          {/* Link color with reference swatch */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              Reference:
            </Typography>
            <Box
              data-testid="reference-swatch"
              sx={{
                width: 20,
                height: 20,
                backgroundColor: TARGET_HEX,
                borderRadius: 0.5,
                border: '1px solid #555',
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            label="Link color (hex)"
            value={linkColor}
            onChange={(e) => setLinkColor(e.target.value)}
            error={!isValid && linkColor.length > 0}
            helperText={!isValid && linkColor.length > 0 ? 'Invalid HEX color' : ' '}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#90caf9' },
              },
              '& .MuiInputLabel-root': { color: '#aaa' },
              '& .MuiFormHelperText-root': { color: '#888' },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: isValid ? linkColor : '#333',
                        borderRadius: 0.5,
                        border: '1px solid #555',
                      }}
                    />
                  </InputAdornment>
                ),
              },
              htmlInput: {
                'data-testid': 'link-color-input',
              },
            }}
          />
          
          {/* Underline links switch */}
          <FormControlLabel
            control={
              <Switch
                checked={underlineLinks}
                onChange={(e) => setUnderlineLinks(e.target.checked)}
                sx={{ '& .MuiSwitch-track': { backgroundColor: '#555' } }}
              />
            }
            label={<Typography sx={{ color: '#ccc' }}>Underline links</Typography>}
          />
          
          {/* Link style select */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#aaa' }}>Link style</InputLabel>
            <Select
              value={linkStyle}
              label="Link style"
              onChange={(e) => setLinkStyle(e.target.value)}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                '& .MuiSvgIcon-root': { color: '#aaa' },
              }}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="bold">Bold</MenuItem>
              <MenuItem value="italic">Italic</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
