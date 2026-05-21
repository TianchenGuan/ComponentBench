'use client';

/**
 * listbox_multi-mui-T07: Match preview chips: enable integrations
 *
 * Layout: settings_panel centered. The panel has two columns.
 * Left column: a small box titled "Enabled in preview" displaying 3 chips (text labels) representing the desired enabled integrations.
 * Right column: the target component, a checkbox listbox titled "Integrations" implemented as a MUI List.
 * Options (12): Slack, Jira, GitHub, GitLab, Linear, PagerDuty, Notion, Google Drive, Dropbox, Zoom, Teams, Zapier.
 * Initial state: none selected.
 * Guidance is mixed/visual: the target items are specified by reading the chips in the preview box.
 *
 * Success: The target listbox has exactly: Slack, Jira, PagerDuty.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const referenceChips = ['Slack', 'Jira', 'PagerDuty'];

const options = [
  'Slack',
  'Jira',
  'GitHub',
  'GitLab',
  'Linear',
  'PagerDuty',
  'Notion',
  'Google Drive',
  'Dropbox',
  'Zoom',
  'Teams',
  'Zapier',
];

const targetSet = referenceChips;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleToggle = (value: string) => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelected(newSelected);
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Integrations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Integrations: match Enabled in preview.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Enabled in preview
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {referenceChips.map((chip) => (
                  <Chip key={chip} label={chip} size="small" color="primary" />
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="subtitle2" gutterBottom>
              Integrations
            </Typography>
            <List
              data-testid="listbox-integrations"
              sx={{ border: '1px solid #e0e0e0', borderRadius: 1, maxHeight: 280, overflow: 'auto' }}
            >
              {options.map((opt) => (
                <ListItem key={opt} disablePadding>
                  <ListItemButton onClick={() => handleToggle(opt)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selected.includes(opt)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={opt} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
