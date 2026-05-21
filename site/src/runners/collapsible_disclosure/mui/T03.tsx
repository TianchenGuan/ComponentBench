'use client';

/**
 * collapsible_disclosure-mui-T03: Controlled group: switch to Privacy
 * 
 * A centered "Profile settings" card contains a controlled accordion group (classic single-expand behavior).
 * 
 * - Layout: isolated_card, centered.
 * - Component: 3 MUI Accordions wired to shared state so only one can be expanded:
 *   - "Profile" (expanded initially)
 *   - "Privacy"
 *   - "Billing"
 * - Initial state: only "Profile" is expanded.
 * - Interaction: clicking a different accordion summary expands it and collapses the previously expanded one.
 * 
 * Success: expanded_panels equals ["Privacy"]
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string | false>('profile');

  useEffect(() => {
    if (expanded === 'privacy') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Profile settings</Typography>
      
      <div data-testid="accordion-root">
        <Accordion 
          expanded={expanded === 'profile'} 
          onChange={handleChange('profile')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Profile</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Manage your profile information, display name, and avatar.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'privacy'} 
          onChange={handleChange('privacy')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Privacy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Control your privacy settings, data sharing preferences, and visibility options.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'billing'} 
          onChange={handleChange('billing')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Billing</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              View and manage your billing information and payment methods.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
