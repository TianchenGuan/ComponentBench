'use client';

/**
 * hover_card-mui-T08: Open hover card from dense table icon (dark, compact)
 *
 * Layout: table_cell scene anchored near the top-left of the viewport. Dark theme, compact spacing, small scale.
 *
 * The page shows a compact issues table with two rows:
 * - Row 1: "Payment failure"
 * - Row 2: "Signup spike"
 *
 * Each row has two tiny status icons in adjacent columns ("Blocked" and "Flagged").
 * - Hovering each icon opens a MUI Tooltip/Popper-based hover card (two hover card instances total).
 * - The two icons are visually similar (same size, similar color) and close together, increasing mis-hover risk.
 * - The hover card content describes the status and recommended action.
 *
 * Initial state: all hover cards closed.
 * Clutter: medium (table header, column sort indicators, and a sidebar are present but irrelevant).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BlockIcon from '@mui/icons-material/Block';
import FlagIcon from '@mui/icons-material/Flag';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const issues = [
  { name: 'Payment failure', blockedTip: 'Blocked: Requires manual review.', flaggedTip: 'Flagged: Potential fraud detected.' },
  { name: 'Signup spike', blockedTip: 'Blocked: Rate limit exceeded.', flaggedTip: 'Flagged: Unusual activity pattern.' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [activeInstance, setActiveInstance] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeInstance === 'Payment failure: Flagged' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeInstance, onSuccess]);

  const createHoverCardContent = (issue: string, type: 'Blocked' | 'Flagged', tip: string) => (
    <Card 
      sx={{ minWidth: 200, boxShadow: 3, bgcolor: '#2a2a2a' }}
      data-testid={`hover-card-${issue.replace(' ', '-').toLowerCase()}-${type.toLowerCase()}`}
      data-cb-instance={`${issue}: ${type}`}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#fff', mb: 0.5 }}>
          {type}
        </Typography>
        <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: 12 }}>
          {tip}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ width: 450, bgcolor: '#1e1e1e' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>Issues</Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#999', fontSize: 11, py: 1 }}>Issue</TableCell>
                  <TableCell sx={{ color: '#999', fontSize: 11, py: 1 }}>Blocked</TableCell>
                  <TableCell sx={{ color: '#999', fontSize: 11, py: 1 }}>Flagged</TableCell>
                  <TableCell sx={{ color: '#999', fontSize: 11, py: 1 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.name}>
                    <TableCell sx={{ color: '#e0e0e0', fontSize: 12, py: 0.75 }}>
                      {issue.name}
                    </TableCell>
                    <TableCell sx={{ py: 0.75 }}>
                      <Tooltip
                        title={createHoverCardContent(issue.name, 'Blocked', issue.blockedTip)}
                        onOpen={() => setActiveInstance(`${issue.name}: Blocked`)}
                        onClose={() => setActiveInstance(null)}
                        arrow={false}
                        placement="bottom"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: 'transparent',
                              p: 0,
                              maxWidth: 'none'
                            }
                          }
                        }}
                      >
                        <IconButton 
                          size="small" 
                          sx={{ p: 0.25 }}
                          data-testid={`${issue.name.replace(' ', '-').toLowerCase()}-blocked`}
                          aria-label={`${issue.name} blocked`}
                        >
                          <BlockIcon sx={{ fontSize: 14, color: '#ff5252' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: 0.75 }}>
                      <Tooltip
                        title={createHoverCardContent(issue.name, 'Flagged', issue.flaggedTip)}
                        onOpen={() => setActiveInstance(`${issue.name}: Flagged`)}
                        onClose={() => setActiveInstance(null)}
                        arrow={false}
                        placement="bottom"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: 'transparent',
                              p: 0,
                              maxWidth: 'none'
                            }
                          }
                        }}
                      >
                        <IconButton 
                          size="small" 
                          sx={{ p: 0.25 }}
                          data-testid={`${issue.name.replace(' ', '-').toLowerCase()}-flagged`}
                          data-cb-instance={`${issue.name}: Flagged`}
                          aria-label={`${issue.name} flagged`}
                        >
                          <FlagIcon sx={{ fontSize: 14, color: '#ffa726' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ color: '#999', fontSize: 11, py: 0.75 }}>
                      2h ago
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
