'use client';

/**
 * collapsible_disclosure-mui-T04: Drawer: open customization and expand Widgets
 * 
 * The dashboard page uses a right-side drawer overlay.
 * 
 * - Layout: drawer_flow.
 * - Trigger: button labeled "Customize dashboard" opens a MUI Drawer anchored on the right.
 * - Inside the drawer: a vertical list of MUI Accordions:
 *   - "Theme"
 *   - "Layout"
 *   - "Widgets"
 *   - "Shortcuts"
 * - Initial state: all drawer accordions are collapsed.
 * - The drawer contains only the accordion list and a close icon; no other controls are needed for success.
 * 
 * Success: Drawer is open AND "Widgets" is expanded
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Button,
  Drawer,
  Box,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (drawerOpen && expanded.includes('widgets') && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [drawerOpen, expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(prev => 
      isExpanded 
        ? [...prev, panel] 
        : prev.filter(p => p !== panel)
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Dashboard</Typography>
      <Typography sx={{ mb: 2 }}>
        Welcome to your dashboard. Customize your experience by clicking the button below.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setDrawerOpen(true)}
        data-testid="open-drawer-button"
      >
        Customize dashboard
      </Button>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="customization-drawer"
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Customize dashboard</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Accordion 
            expanded={expanded.includes('theme')} 
            onChange={handleChange('theme')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Theme</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Choose between light, dark, or system theme.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded.includes('layout')} 
            onChange={handleChange('layout')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Layout</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Configure dashboard layout and column arrangement.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded.includes('widgets')} 
            onChange={handleChange('widgets')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Widgets</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Add, remove, or reorder dashboard widgets.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded.includes('shortcuts')} 
            onChange={handleChange('shortcuts')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Shortcuts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Manage keyboard shortcuts and quick actions.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </Paper>
  );
}
