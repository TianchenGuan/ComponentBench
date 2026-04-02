'use client';

/**
 * listbox_multi-mui-T02: Push notification types
 *
 * Layout: form_section centered. At the top is a small profile form (Name field and Timezone dropdown) that is unrelated.
 * Below are two separate checkbox listboxes (instances=2):
 *   - "Email notifications" list (left) with options like Weekly summary, Product tips, Billing receipts.
 *   - "Push notifications" list (right) with options: Mentions, Direct messages, Security alerts, Outage updates.
 * Each list is a Material UI List with a checkbox per row.
 * Initial state: some Email notifications are preselected (Weekly summary checked), but Push notifications start with none selected.
 * No overlays. No scrolling.
 *
 * Success: The target listbox (Push notifications) has exactly: Mentions, Security alerts.
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const emailOptions = ['Weekly summary', 'Product tips', 'Billing receipts'];
const pushOptions = ['Mentions', 'Direct messages', 'Security alerts', 'Outage updates'];
const targetSet = ['Mentions', 'Security alerts'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [emailSelected, setEmailSelected] = useState<string[]>(['Weekly summary']);
  const [pushSelected, setPushSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(pushSelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [pushSelected, onSuccess]);

  const handleEmailToggle = (value: string) => {
    const currentIndex = emailSelected.indexOf(value);
    const newSelected = [...emailSelected];
    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setEmailSelected(newSelected);
  };

  const handlePushToggle = (value: string) => {
    const currentIndex = pushSelected.indexOf(value);
    const newSelected = [...pushSelected];
    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setPushSelected(newSelected);
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification channels
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField label="Name" size="small" sx={{ mr: 2, mb: 1 }} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Timezone</InputLabel>
            <Select label="Timezone" defaultValue="utc">
              <MenuItem value="utc">UTC</MenuItem>
              <MenuItem value="est">EST</MenuItem>
              <MenuItem value="pst">PST</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Email notifications
            </Typography>
            <List
              data-testid="listbox-email-notifications"
              sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
            >
              {emailOptions.map((opt) => (
                <ListItem key={opt} disablePadding>
                  <ListItemButton onClick={() => handleEmailToggle(opt)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={emailSelected.includes(opt)}
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
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Push notifications
            </Typography>
            <List
              data-testid="listbox-push-notifications"
              sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
            >
              {pushOptions.map((opt) => (
                <ListItem key={opt} disablePadding>
                  <ListItemButton onClick={() => handlePushToggle(opt)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={pushSelected.includes(opt)}
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
