'use client';

/**
 * collapsible_disclosure-mui-T08: Compact precision: leave only Advanced and Security open
 * 
 * A dense settings card uses compact spacing and contains multiple independent accordions.
 * 
 * - Layout: isolated_card, centered.
 * - Spacing: compact (reduced padding and smaller gaps).
 * - Component: 5 independent MUI Accordions (multiple can be expanded at once).
 *   Titles: "General", "Security", "Notifications", "API", "Advanced".
 * - Initial state: "General" and "Advanced" are expanded; the rest are collapsed.
 * - Success requires an exact final set: only "Advanced" and "Security" expanded.
 * 
 * Success: expanded_panels equals exactly ["Advanced", "Security"]
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

const ACCORDION_ITEMS = [
  { key: 'general', label: 'General', content: 'General settings and preferences.' },
  { key: 'security', label: 'Security', content: 'Security and authentication options.' },
  { key: 'notifications', label: 'Notifications', content: 'Notification preferences.' },
  { key: 'api', label: 'API', content: 'API keys and access tokens.' },
  { key: 'advanced', label: 'Advanced', content: 'Advanced configuration options.' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string[]>(['general', 'advanced']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when exactly Advanced and Security are expanded
    const sortedKeys = [...expanded].sort();
    if (
      sortedKeys.length === 2 &&
      sortedKeys[0] === 'advanced' &&
      sortedKeys[1] === 'security' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
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
    <Paper elevation={2} sx={{ width: 400, p: 1 }}>
      <Typography variant="subtitle1" sx={{ px: 1, py: 0.5 }}>Compact settings</Typography>
      
      <div data-testid="accordion-root">
        {ACCORDION_ITEMS.map(item => (
          <Accordion 
            key={item.key}
            expanded={expanded.includes(item.key)} 
            onChange={handleChange(item.key)}
            disableGutters
            sx={{ 
              '&:before': { display: 'none' },
              boxShadow: 'none',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon fontSize="small" />}
              sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}
            >
              <Typography variant="body2">{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ py: 1, px: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {item.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Paper>
  );
}
