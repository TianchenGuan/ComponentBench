'use client';

/**
 * accordion-mui-T08: Compact small: open Security audit in dense list
 * 
 * A centered isolated card uses compact spacing and a small scale variant (smaller 
 * typography and tighter padding). It contains a single MUI Accordion list with 12 items 
 * representing admin topics. Initial state: all collapsed. The small, dense summary rows 
 * increase the chance of clicking the wrong item.
 * 
 * Success: expanded_item_ids equals exactly: [security_audit]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

const items = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'roles', label: 'Roles' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'api_keys', label: 'API keys' },
  { key: 'webhooks', label: 'Webhooks' },
  { key: 'security_audit', label: 'Security audit' },
  { key: 'sso', label: 'SSO' },
  { key: 'billing', label: 'Billing' },
  { key: 'usage', label: 'Usage' },
  { key: 'exports', label: 'Exports' },
  { key: 'advanced', label: 'Advanced' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === 'security_audit') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={2} sx={{ width: 400, p: 1.5 }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>Admin Settings</Typography>
      
      <div data-testid="accordion-root">
        {items.map(item => (
          <Accordion 
            key={item.key}
            expanded={expanded === item.key} 
            onChange={handleChange(item.key)}
            sx={{
              '&:before': { display: 'none' },
              boxShadow: 'none',
              '&.Mui-expanded': { margin: 0 },
            }}
            disableGutters
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                minHeight: 32,
                '& .MuiAccordionSummary-content': { margin: '4px 0' },
                py: 0,
              }}
            >
              <Typography variant="body2">{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ py: 1, px: 2 }}>
              <Typography variant="caption">Settings for {item.label.toLowerCase()}.</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Paper>
  );
}
