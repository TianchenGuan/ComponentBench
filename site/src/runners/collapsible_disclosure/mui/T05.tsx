'use client';

/**
 * collapsible_disclosure-mui-T05: Scroll list: expand Integrations
 * 
 * A centered settings card contains a long accordion list in a fixed-height scroll area.
 * 
 * - Layout: isolated_card, centered.
 * - Component: a stack of 14 MUI Accordions contained in an inner scrollable div (height ~360px).
 * - Items include: "Appearance", "Notifications", "Security", "API", "Integrations", "Webhooks", "Backups", etc.
 * - Initial state: all items collapsed.
 * - The "Integrations" item is near the bottom and is not initially visible; you must scroll inside the card.
 * 
 * Success: "Integrations" is expanded
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

const ACCORDION_ITEMS = [
  { key: 'appearance', label: 'Appearance', content: 'Theme and display settings.' },
  { key: 'account', label: 'Account', content: 'Account information and settings.' },
  { key: 'notifications', label: 'Notifications', content: 'Notification preferences.' },
  { key: 'security', label: 'Security', content: 'Security and authentication settings.' },
  { key: 'privacy', label: 'Privacy', content: 'Privacy and data sharing options.' },
  { key: 'language', label: 'Language', content: 'Language and regional settings.' },
  { key: 'api', label: 'API', content: 'API keys and access tokens.' },
  { key: 'integrations', label: 'Integrations', content: 'Third-party integrations and connected services.' },
  { key: 'webhooks', label: 'Webhooks', content: 'Webhook endpoints and events.' },
  { key: 'backups', label: 'Backups', content: 'Backup and restore options.' },
  { key: 'billing', label: 'Billing', content: 'Billing and payment settings.' },
  { key: 'team', label: 'Team', content: 'Team member management.' },
  { key: 'audit', label: 'Audit Log', content: 'Activity and audit logs.' },
  { key: 'advanced', label: 'Advanced', content: 'Advanced configuration options.' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (expanded.includes('integrations')) {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(prev => 
      isExpanded 
        ? [...prev, panel] 
        : prev.filter(p => p !== panel)
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Settings</Typography>
      
      <Box 
        sx={{ 
          height: 360, 
          overflowY: 'auto',
          pr: 1,
        }}
        data-testid="scroll-container"
      >
        {ACCORDION_ITEMS.map(item => (
          <Accordion 
            key={item.key}
            expanded={expanded.includes(item.key)} 
            onChange={handleChange(item.key)}
            data-testid={`acc-${item.key}`}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
}
