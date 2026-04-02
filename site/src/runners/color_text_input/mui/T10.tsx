'use client';

/**
 * color_text_input-mui-T10: Open a drawer and set Focus ring color among multiple fields (MUI)
 *
 * Layout: drawer_flow. The main page shows a 'Theme tokens' button; clicking it opens a
 * right-side MUI Drawer.
 *
 * Inside the drawer: a dense list of token rows (typography, spacing, colors).
 * In the 'Colors' subsection there are two similar color text fields: 'Focus ring color (hex)'
 * and 'Selection color (hex)'.
 *
 * Instances: 2 color text inputs in the drawer, both with preview squares and identical placeholders.
 * Initial state: Focus ring color=#26c6da; Selection color=#90caf9.
 *
 * Clutter: the drawer includes many non-interactive labels and a scrollable area.
 * Feedback: when valid, the Focus ring preview updates; invalid values show an error helper text.
 *
 * Success: The Focus ring color field in the open drawer parses to RGBA(0, 188, 212, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, Button, Drawer, TextField, Typography, Box,
  Divider, InputAdornment, List, ListItem, ListSubheader
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 0, g: 188, b: 212, a: 1 };

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [focusRingColor, setFocusRingColor] = useState('#26c6da');
  const [selectionColor, setSelectionColor] = useState('#90caf9');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isFocusRingValid = isValidHex6(focusRingColor);
  const isSelectionValid = isValidHex6(selectionColor);
  const focusRingParsed = hexToRgba(focusRingColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (focusRingParsed && isColorWithinTolerance(focusRingParsed, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [focusRingParsed, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <>
      <Card sx={{ width: 300, textAlign: 'center' }}>
        <CardContent>
          <Button
            variant="contained"
            onClick={() => setDrawerOpen(true)}
            data-testid="theme-tokens-btn"
          >
            Theme tokens
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="theme-tokens-drawer"
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Theme Tokens
          </Typography>
          
          <List dense>
            {/* Typography section */}
            <ListSubheader sx={{ bgcolor: 'transparent' }}>Typography</ListSubheader>
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">Font family</Typography>
              <Typography variant="body2" color="text.secondary">Inter</Typography>
            </ListItem>
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">Base size</Typography>
              <Typography variant="body2" color="text.secondary">16px</Typography>
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            {/* Spacing section */}
            <ListSubheader sx={{ bgcolor: 'transparent' }}>Spacing</ListSubheader>
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">Unit</Typography>
              <Typography variant="body2" color="text.secondary">8px</Typography>
            </ListItem>
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">Border radius</Typography>
              <Typography variant="body2" color="text.secondary">4px</Typography>
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            {/* Colors section */}
            <ListSubheader sx={{ bgcolor: 'transparent' }}>Colors</ListSubheader>
            
            <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Focus ring color (hex)</Typography>
              <TextField
                size="small"
                fullWidth
                value={focusRingColor}
                onChange={(e) => setFocusRingColor(e.target.value)}
                error={!isFocusRingValid}
                helperText={!isFocusRingValid ? 'Invalid HEX' : ' '}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            backgroundColor: isFocusRingValid ? focusRingColor : '#e0e0e0',
                            borderRadius: 0.5,
                            border: '1px solid #ccc',
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    'data-testid': 'focus-ring-color-input',
                  },
                }}
              />
            </ListItem>
            
            <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Selection color (hex)</Typography>
              <TextField
                size="small"
                fullWidth
                value={selectionColor}
                onChange={(e) => setSelectionColor(e.target.value)}
                error={!isSelectionValid}
                helperText={!isSelectionValid ? 'Invalid HEX' : ' '}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            backgroundColor: isSelectionValid ? selectionColor : '#e0e0e0',
                            borderRadius: 0.5,
                            border: '1px solid #ccc',
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    'data-testid': 'selection-color-input',
                  },
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
