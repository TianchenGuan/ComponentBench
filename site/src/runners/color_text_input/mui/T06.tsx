'use client';

/**
 * color_text_input-mui-T06: Edit a color field inside a table cell (MUI)
 *
 * Layout: table_cell. A small table titled 'Status colors' has two rows: 'Success' and 'Warning'.
 * Each row has a 'Color (hex)' column with a compact MUI TextField.
 *
 * Instances: 2 color text inputs, one per row; both use the same placeholder and a tiny preview square.
 * Initial state: Success=#2e7d32, Warning=#f9a825.
 *
 * Clutter: table contains extra columns (example label chips) but only the Warning color field matters.
 * Feedback: the Warning row's preview chip updates when the field becomes valid.
 *
 * Success: The Warning row color field parses to RGBA(237, 108, 2, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Box, Chip, InputAdornment
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 237, g: 108, b: 2, a: 1 };

export default function T06({ onSuccess }: TaskComponentProps) {
  const [successColor, setSuccessColor] = useState('#2e7d32');
  const [warningColor, setWarningColor] = useState('#f9a825');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isSuccessValid = isValidHex6(successColor);
  const isWarningValid = isValidHex6(warningColor);
  const warningParsed = hexToRgba(warningColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (warningParsed && isColorWithinTolerance(warningParsed, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [warningParsed, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Status colors
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Example</TableCell>
                <TableCell>Color (hex)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow data-row="success">
                <TableCell>Success</TableCell>
                <TableCell>
                  <Chip
                    label="Approved"
                    size="small"
                    sx={{ backgroundColor: isSuccessValid ? successColor : '#e0e0e0', color: '#fff' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={successColor}
                    onChange={(e) => setSuccessColor(e.target.value)}
                    error={!isSuccessValid}
                    sx={{ width: 140 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: isSuccessValid ? successColor : '#e0e0e0',
                                borderRadius: 0.5,
                                border: '1px solid #ccc',
                              }}
                            />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: {
                        'data-testid': 'success-row-color-input',
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow data-row="warning">
                <TableCell>Warning</TableCell>
                <TableCell>
                  <Chip
                    label="Pending"
                    size="small"
                    sx={{ backgroundColor: isWarningValid ? warningColor : '#e0e0e0', color: '#fff' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={warningColor}
                    onChange={(e) => setWarningColor(e.target.value)}
                    error={!isWarningValid}
                    sx={{ width: 140 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: isWarningValid ? warningColor : '#e0e0e0',
                                borderRadius: 0.5,
                                border: '1px solid #ccc',
                              }}
                            />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: {
                        'data-testid': 'warning-row-color-input',
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
