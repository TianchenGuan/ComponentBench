'use client';

/**
 * accordion-mui-T04: Settings topics: open Billing and Notifications
 * 
 * A centered isolated card titled "Settings topics" contains 6 MUI Accordion items: 
 * "Profile", "Security", "Billing", "Notifications", "Privacy", "Connected apps". 
 * Multiple items can be expanded at once. Initial state: all items collapsed. 
 * Expanding an item reveals short placeholder text and a disabled action button 
 * inside AccordionDetails (distractor).
 * 
 * Success: expanded_item_ids equals exactly: [billing, notifications]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (expandedItems.size === 2 && expandedItems.has('billing') && expandedItems.has('notifications')) {
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

  const items = [
    { key: 'profile', label: 'Profile', content: 'Manage your profile information.' },
    { key: 'security', label: 'Security', content: 'Update security settings.' },
    { key: 'billing', label: 'Billing', content: 'Manage billing and payment details.' },
    { key: 'notifications', label: 'Notifications', content: 'Configure notification preferences.' },
    { key: 'privacy', label: 'Privacy', content: 'Control your privacy settings.' },
    { key: 'connected_apps', label: 'Connected apps', content: 'Manage connected applications.' },
  ];

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Settings topics</Typography>
      
      <div data-testid="accordion-root">
        {items.map(item => (
          <Accordion 
            key={item.key}
            expanded={expandedItems.has(item.key)} 
            onChange={handleChange(item.key)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ mb: 2 }}>{item.content}</Typography>
              <Button variant="outlined" size="small" disabled>
                Edit settings
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Paper>
  );
}
