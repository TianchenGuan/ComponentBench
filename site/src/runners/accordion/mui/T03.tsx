'use client';

/**
 * accordion-mui-T03: Help topics: reset to all collapsed
 * 
 * A centered isolated card titled "Help topics" contains 5 MUI Accordion items: 
 * "Getting started", "Billing", "Integrations", "Security", and "Troubleshooting". 
 * Because each MUI Accordion is independent, multiple items can be expanded. 
 * Initial state: "Billing" and "Security" are expanded; the other three are collapsed.
 * 
 * Success: expanded_item_ids equals exactly: []
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['billing', 'security']));

  useEffect(() => {
    if (expandedItems.size === 0) {
      onSuccess();
    }
  }, [expandedItems, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(panel);
      } else {
        newSet.delete(panel);
      }
      return newSet;
    });
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Help topics</Typography>
      
      <div data-testid="accordion-root">
        <Accordion 
          expanded={expandedItems.has('getting_started')} 
          onChange={handleChange('getting_started')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Getting started</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Learn the basics of using our platform.</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expandedItems.has('billing')} 
          onChange={handleChange('billing')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Billing</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Manage your subscription and payment details.</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expandedItems.has('integrations')} 
          onChange={handleChange('integrations')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Integrations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Connect with third-party services and tools.</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expandedItems.has('security')} 
          onChange={handleChange('security')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Security</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Configure security settings and access controls.</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expandedItems.has('troubleshooting')} 
          onChange={handleChange('troubleshooting')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Troubleshooting</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Solutions for common issues and problems.</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
