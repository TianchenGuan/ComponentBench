'use client';

/**
 * collapsible_disclosure-mui-T06: Match reference: expand the accordion that matches the Target summary
 * 
 * A single card titled "Accordion matching" contains:
 * 
 * - A "Target summary" preview card at the top. The preview renders an accordion summary row (icon + label) exactly as it appears in the list.
 * - Below, a list of 6 MUI Accordions with icons and labels such as:
 *   - "Alerts", "Messages", "Reminders", "Updates", "Mentions", "News"
 * - Initial state: all items collapsed.
 * - Guidance: visual; the agent must match the target preview to the correct accordion summary.
 * 
 * Success: Exactly one accordion expanded, matching the Target summary preview
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ArticleIcon from '@mui/icons-material/Article';
import type { TaskComponentProps } from '../types';

// Target is "Updates" with UpdateIcon
const TARGET_KEY = 'updates';

const ACCORDION_ITEMS = [
  { key: 'alerts', label: 'Alerts', icon: <NotificationsIcon sx={{ mr: 1 }} />, content: 'System alerts and notifications.' },
  { key: 'messages', label: 'Messages', icon: <MailIcon sx={{ mr: 1 }} />, content: 'Your message inbox.' },
  { key: 'reminders', label: 'Reminders', icon: <AccessTimeIcon sx={{ mr: 1 }} />, content: 'Upcoming reminders.' },
  { key: 'updates', label: 'Updates', icon: <UpdateIcon sx={{ mr: 1 }} />, content: 'System updates and changelog.' },
  { key: 'mentions', label: 'Mentions', icon: <AlternateEmailIcon sx={{ mr: 1 }} />, content: 'Places where you were mentioned.' },
  { key: 'news', label: 'News', icon: <ArticleIcon sx={{ mr: 1 }} />, content: 'Latest news and announcements.' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when only the target is expanded
    if (expanded.length === 1 && expanded[0] === TARGET_KEY && !hasSucceeded.current) {
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
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Accordion matching</Typography>
      
      {/* Target preview */}
      <Box 
        data-testid="target-summary-preview"
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'grey.100',
          borderRadius: 1,
          border: '2px dashed',
          borderColor: 'primary.main',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Target summary:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <UpdateIcon sx={{ mr: 1 }} />
          <Typography>Updates</Typography>
        </Box>
      </Box>
      
      <div data-testid="accordion-root">
        {ACCORDION_ITEMS.map(item => (
          <Accordion 
            key={item.key}
            expanded={expanded.includes(item.key)} 
            onChange={handleChange(item.key)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Paper>
  );
}
