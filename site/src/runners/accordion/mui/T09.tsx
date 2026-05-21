'use client';

/**
 * accordion-mui-T09: Dark theme: match status dot to open the correct service
 * 
 * Scene is an isolated card in dark theme titled "Service status". Above the accordion 
 * list, a small "Reference status" dot is displayed (no text label). Below it is a MUI 
 * Accordion list with 7 services; each AccordionSummary shows a small colored dot at the 
 * left, then the service name. The task is defined by visual dot matching; multiple 
 * services have similar names, and the dark theme reduces contrast around the dots.
 * Initial state: all collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [service_target]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

// Service configurations with status dots
const services = [
  { key: 'auth', label: 'Auth', color: '#4caf50' },        // Green
  { key: 'api', label: 'API', color: '#2196f3' },          // Blue
  { key: 'billing', label: 'Billing', color: '#9c27b0' },   // Purple
  { key: 'service_target', label: 'Search', color: '#ff9800' }, // Orange - TARGET
  { key: 'uploads', label: 'Uploads', color: '#f44336' },  // Red
  { key: 'exports', label: 'Exports', color: '#00bcd4' },  // Cyan
  { key: 'webhooks', label: 'Webhooks', color: '#ffc107' }, // Amber (similar to orange)
];

// The target service (Search with orange dot)
const targetService = services[3];

const StatusDot = ({ color }: { color: string }) => (
  <Box
    sx={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === 'service_target') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: 450, 
        p: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Service status</Typography>
      
      {/* Reference status dot */}
      <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          Reference status:
        </Typography>
        <StatusDot color={targetService.color} />
      </Box>
      
      <div data-testid="accordion-root">
        {services.map(service => (
          <Accordion 
            key={service.key}
            expanded={expanded === service.key} 
            onChange={handleChange(service.key)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <StatusDot color={service.color} />
                <Typography>{service.label}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {service.label} service is operational. Last checked: 2 minutes ago.
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Paper>
  );
}
