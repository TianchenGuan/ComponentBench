'use client';

/**
 * accordion-mui-T10: Drawer help: open Keyboard shortcuts section
 * 
 * Scene uses a drawer_flow layout. The main page shows a small header ("Editor") and 
 * a button labeled "Help". Clicking "Help" opens a right-side MUI Drawer (placement 
 * top_right). Inside the drawer is the target MUI Accordion list with 5 items. 
 * Initial state when the drawer opens: all items collapsed. The drawer also contains 
 * a close icon button at the top as a distractor.
 * 
 * Success: expanded_item_ids equals exactly: [keyboard_shortcuts]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Button,
  Drawer,
  Box,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === 'keyboard_shortcuts') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setExpanded(false); // Reset when drawer opens
  };

  const items = [
    { key: 'getting_started', label: 'Getting started', content: 'Learn the basics of the editor.' },
    { key: 'keyboard_shortcuts', label: 'Keyboard shortcuts', content: 'Common keyboard shortcuts for faster editing.' },
    { key: 'formatting', label: 'Formatting', content: 'Text formatting options and tools.' },
    { key: 'troubleshooting', label: 'Troubleshooting', content: 'Solutions for common issues.' },
    { key: 'about', label: 'About', content: 'About this editor application.' },
  ];

  return (
    <>
      <Paper elevation={2} sx={{ width: 400, p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Editor</Typography>
        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          Start writing your content here. Click the Help button for assistance.
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<HelpOutlineIcon />}
          onClick={handleOpenDrawer}
        >
          Help
        </Button>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="help-drawer"
      >
        <Box sx={{ width: 350, p: 2 }}>
          {/* Close button (distractor) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>Help</Typography>
          
          <div data-testid="accordion-root">
            {items.map(item => (
              <Accordion 
                key={item.key}
                expanded={expanded === item.key} 
                onChange={handleChange(item.key)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{item.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.content}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Box>
      </Drawer>
    </>
  );
}
