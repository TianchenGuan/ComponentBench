'use client';

/**
 * collapsible_disclosure-mui-T07: Sidebar navigation: expand Workspace group
 * 
 * A settings page is arranged as a two-column panel.
 * 
 * - Layout: settings_panel (sidebar + main content).
 * - Left sidebar: 4 MUI Accordions used as navigation groups:
 *   - "Account", "Workspace", "Billing", "Support"
 * - Each group reveals a small list of links when expanded; links are present as realistic clutter but are not required for success.
 * - Initial state: all groups collapsed.
 * - Right side: static placeholder content (not interactive).
 * 
 * Success: "Workspace" is expanded
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Box,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

const SIDEBAR_ITEMS = [
  { 
    key: 'account', 
    label: 'Account', 
    links: ['Profile', 'Preferences', 'Security'] 
  },
  { 
    key: 'workspace', 
    label: 'Workspace', 
    links: ['General', 'Members', 'Permissions', 'Integrations'] 
  },
  { 
    key: 'billing', 
    label: 'Billing', 
    links: ['Plans', 'Payment methods', 'Invoices'] 
  },
  { 
    key: 'support', 
    label: 'Support', 
    links: ['Help center', 'Contact us', 'Status'] 
  },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (expanded.includes('workspace')) {
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
    <Paper elevation={2} sx={{ width: 700, display: 'flex' }}>
      {/* Sidebar */}
      <Box 
        sx={{ 
          width: 250, 
          borderRight: 1, 
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
        data-testid="sidebar"
      >
        <Typography variant="subtitle2" sx={{ p: 2, color: 'text.secondary' }}>
          Settings
        </Typography>
        
        {SIDEBAR_ITEMS.map(item => (
          <Accordion 
            key={item.key}
            expanded={expanded.includes(item.key)} 
            onChange={handleChange(item.key)}
            disableGutters
            elevation={0}
            sx={{ 
              bgcolor: 'transparent',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ minHeight: 48, px: 2 }}
            >
              <Typography>{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List dense disablePadding>
                {item.links.map(link => (
                  <ListItemButton key={link} sx={{ pl: 4 }}>
                    <ListItemText 
                      primary={link} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        <Typography color="text.secondary">
          Select a category from the sidebar to view and edit settings.
        </Typography>
      </Box>
    </Paper>
  );
}
