'use client';

/**
 * collapsible_disclosure-mui-T09: Table cell: expand SMTP settings details
 * 
 * A dense integrations table contains a collapsible disclosure embedded in one cell.
 * 
 * - Layout: table_cell.
 * - The table has several columns (Name, Status, Last sync, Details) with typical controls like switches and chips.
 * - Target component: a single MUI Accordion titled "SMTP settings" located in the Details column.
 * - Initial state: collapsed (no details visible).
 * - The accordion summary button is smaller because it sits inside a narrow cell and competes with nearby controls.
 * 
 * Success: "SMTP settings" is expanded
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

const TABLE_DATA = [
  { id: 'slack', name: 'Slack', status: true, sync: '2 hours ago', hasDetails: false },
  { id: 'smtp', name: 'Email (SMTP)', status: true, sync: '1 hour ago', hasDetails: true },
  { id: 'webhook', name: 'Webhooks', status: false, sync: 'Never', hasDetails: false },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    slack: true,
    smtp: true,
    webhook: false,
  });

  useEffect(() => {
    if (expanded) {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 600, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Integrations table</Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last sync</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TABLE_DATA.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Switch 
                    size="small"
                    checked={switches[row.id]} 
                    onChange={(e) => setSwitches(prev => ({ ...prev, [row.id]: e.target.checked }))}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.sync} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {row.hasDetails ? (
                    <Accordion 
                      expanded={expanded}
                      onChange={(_, isExpanded) => setExpanded(isExpanded)}
                      disableGutters
                      sx={{ 
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                        bgcolor: 'transparent',
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon fontSize="small" />}
                        sx={{ 
                          minHeight: 32, 
                          p: 0,
                          '& .MuiAccordionSummary-content': { my: 0 },
                        }}
                      >
                        <Typography variant="body2">SMTP settings</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 1 }}>
                        <Typography variant="caption" component="div">
                          Host: smtp.example.com<br />
                          Port: 587<br />
                          TLS: Enabled
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
