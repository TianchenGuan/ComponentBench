'use client';

/**
 * listbox_single-mui-T06: Choose template from drawer: Meeting notes
 *
 * Scene: light theme, comfortable spacing, drawer_flow layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A centered card titled "New document" includes a button labeled "Choose template". Clicking it opens a
 * right-side MUI Drawer containing a single-select MUI List labeled "Templates" with options:
 * "Blank", "Meeting notes", "Project brief", "Retrospective". Initial selection in the drawer is "Blank".
 * Selection applies immediately (no Save button) and the drawer stays open. A close icon exists but is not required.
 * The main page behind the drawer contains read-only preview text.
 *
 * Success: Selected option value equals: meeting_notes
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Drawer, List, ListItemButton, ListItemText, Box, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

const templateOptions = [
  { value: 'blank', label: 'Blank' },
  { value: 'meeting_notes', label: 'Meeting notes' },
  { value: 'project_brief', label: 'Project brief' },
  { value: 'retrospective', label: 'Retrospective' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string>('blank');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'meeting_notes') {
      onSuccess();
    }
  };

  const selectedLabel = templateOptions.find(t => t.value === selected)?.label || '';

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>New document</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start with a template or create a blank document.
          </Typography>
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Choose template
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Current template: {selectedLabel}
          </Typography>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Templates</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <List
            data-cb-listbox-root
            data-cb-selected-value={selected}
          >
            {templateOptions.map(opt => (
              <ListItemButton
                key={opt.value}
                selected={selected === opt.value}
                onClick={() => handleSelect(opt.value)}
                data-cb-option-value={opt.value}
              >
                <ListItemText primary={opt.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
