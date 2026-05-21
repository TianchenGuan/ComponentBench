'use client';

/**
 * accordion-mui-T06: Dashboard: scroll to System logs and open API logs
 * 
 * Scene uses a dashboard layout with multiple cards (stats tiles, charts placeholders, 
 * and filters) creating medium clutter. The target card is in the right column near 
 * the bottom of the page (bottom_right placement) and is titled "System logs". Inside 
 * it is a MUI Accordion list with 4 items: "API logs", "Auth logs", "Billing logs", 
 * "Export logs". Initial state: all items collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [api_logs]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === 'api_logs') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      {/* Dashboard header */}
      <Typography variant="h5" sx={{ mb: 3 }}>Dashboard</Typography>

      {/* Stats row (clutter) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="h4">1,234</Typography>
            <Typography variant="caption" color="text.secondary">Total Users</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="h4">567</Typography>
            <Typography variant="caption" color="text.secondary">Active Sessions</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="h4">89%</Typography>
            <Typography variant="caption" color="text.secondary">Uptime</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="h4">42ms</Typography>
            <Typography variant="caption" color="text.secondary">Avg Response</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters row (clutter) */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" disabled>
              <InputLabel>Time Range</InputLabel>
              <Select label="Time Range" value="7d">
                <MenuItem value="7d">Last 7 days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" disabled>
              <InputLabel>Environment</InputLabel>
              <Select label="Environment" value="prod">
                <MenuItem value="prod">Production</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts placeholder (clutter) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={8}>
          <Paper sx={{ p: 2, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
            <Typography color="text.secondary">Traffic Chart Placeholder</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
            <Typography color="text.secondary">Pie Chart Placeholder</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* System logs card - the target */}
      <Paper elevation={2} sx={{ p: 2 }} id="system-logs">
        <Typography variant="h6" sx={{ mb: 2 }}>System logs</Typography>
        
        <div data-testid="accordion-root">
          <Accordion 
            expanded={expanded === 'api_logs'} 
            onChange={handleChange('api_logs')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>API logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>View API request and response logs.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'auth_logs'} 
            onChange={handleChange('auth_logs')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Auth logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Authentication and authorization logs.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'billing_logs'} 
            onChange={handleChange('billing_logs')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Billing logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Billing and payment transaction logs.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'export_logs'} 
            onChange={handleChange('export_logs')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Export logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Data export and download logs.</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Paper>
    </Box>
  );
}
