'use client';

/**
 * table_static-mui-T02: Focus the table (active element inside table)
 *
 * A centered isolated card shows a read-only Release Notes table built from Material UI Table components.
 * The table wrapper is focusable (tabIndex=0) and shows a visible focus ring when focused. The table lists Version and Summary
 * columns with a small number of rows. Initial focus is on the page, not on the table. No other controls exist.
 */

import React, { useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface ReleaseNoteData {
  key: string;
  version: string;
  summary: string;
}

const releaseNotesData: ReleaseNoteData[] = [
  { key: '1', version: 'v2.5.0', summary: 'Added dark mode support' },
  { key: '2', version: 'v2.4.1', summary: 'Bug fixes and performance improvements' },
  { key: '3', version: 'v2.4.0', summary: 'New dashboard widgets' },
  { key: '4', version: 'v2.3.2', summary: 'Security patch for auth flow' },
  { key: '5', version: 'v2.3.0', summary: 'API rate limiting improvements' },
  { key: '6', version: 'v2.2.0', summary: 'Export to PDF feature' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const successFiredRef = useRef(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (!successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Release Notes
        </Typography>
        <Box
          tabIndex={0}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-cb-focused={isFocused}
          sx={{
            outline: isFocused ? '2px solid #1976d2' : 'none',
            outlineOffset: 2,
            borderRadius: 1,
          }}
        >
          <TableContainer component={Paper} variant="outlined">
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>Summary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {releaseNotesData.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell>{row.version}</TableCell>
                    <TableCell>{row.summary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Typography variant="body2" sx={{ mt: 1.5, color: isFocused ? 'primary.main' : 'text.secondary' }}>
          {isFocused ? 'Table focused' : 'Click or tab to focus the table'}
        </Typography>
      </CardContent>
    </Card>
  );
}
