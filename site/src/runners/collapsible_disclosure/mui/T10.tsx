'use client';

/**
 * collapsible_disclosure-mui-T10: Dark + two instances: expand Audit settings in Admin controls
 * 
 * The page uses a dark theme and contains two similar accordion lists side-by-side.
 * 
 * - Theme: dark.
 * - Layout: isolated_card, centered.
 * - Instances: 2 MUI accordion groups with clear titles:
 *   - "User preferences"
 *   - "Admin controls"  ← TARGET INSTANCE
 * - Each group contains 4 accordion items. Some labels are similar ("Logs", "Audit settings", "Usage", "Security").
 * - Initial state:
 *   - User preferences: all collapsed
 *   - Admin controls: all collapsed
 * - Success depends on expanding the correct item in the correct instance; other instance must remain unchanged.
 * 
 * Success: In "Admin controls", "Audit settings" is expanded
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
import type { TaskComponentProps } from '../types';

const USER_ITEMS = [
  { key: 'profile', label: 'Profile', content: 'Your profile settings.' },
  { key: 'usage', label: 'Usage', content: 'Your usage statistics.' },
  { key: 'logs', label: 'Logs', content: 'Your activity logs.' },
  { key: 'security', label: 'Security', content: 'Your security settings.' },
];

const ADMIN_ITEMS = [
  { key: 'system', label: 'System', content: 'System configuration.' },
  { key: 'usage', label: 'Usage', content: 'Organization usage statistics.' },
  { key: 'audit_settings', label: 'Audit settings', content: 'Configure audit logging and retention policies.' },
  { key: 'security', label: 'Security', content: 'Organization security settings.' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [userExpanded, setUserExpanded] = useState<string[]>([]);
  const [adminExpanded, setAdminExpanded] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when Admin controls has "Audit settings" expanded AND User preferences remains unchanged
    if (
      adminExpanded.includes('audit_settings') && 
      userExpanded.length === 0 &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [adminExpanded, userExpanded, onSuccess]);

  const handleUserChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setUserExpanded(prev => 
      isExpanded 
        ? [...prev, panel] 
        : prev.filter(p => p !== panel)
    );
  };

  const handleAdminChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setAdminExpanded(prev => 
      isExpanded 
        ? [...prev, panel] 
        : prev.filter(p => p !== panel)
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* User preferences */}
      <Paper elevation={2} sx={{ width: 300, p: 2 }} data-testid="user-preferences">
        <Typography variant="h6" sx={{ mb: 2 }}>User preferences</Typography>
        
        {USER_ITEMS.map(item => (
          <Accordion 
            key={item.key}
            expanded={userExpanded.includes(item.key)} 
            onChange={handleUserChange(item.key)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{item.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Admin controls */}
      <Paper elevation={2} sx={{ width: 300, p: 2 }} data-testid="admin-controls">
        <Typography variant="h6" sx={{ mb: 2 }}>Admin controls</Typography>
        
        {ADMIN_ITEMS.map(item => (
          <Accordion 
            key={item.key}
            expanded={adminExpanded.includes(item.key)} 
            onChange={handleAdminChange(item.key)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{item.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
}
