'use client';

/**
 * notification_center-mui-T02: Mute pop-up snackbars
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with the Notification Center Drawer already open on page load.
 * The drawer header shows the title "Notification Center".
 * 
 * Directly under the title is a settings row containing an MUI Switch labeled "Mute pop-up snackbars".
 * Initial state: the switch is OFF.
 * 
 * Below the setting is the notification inbox list (Alert-styled rows), but list items are irrelevant to this task.
 * Distractors: there is another switch labeled "Email me daily summaries" further down in the drawer; it must not be changed.
 * Feedback: toggling the switch updates its thumb position and shows helper text "Pop-ups are muted" under the setting.
 *
 * success_trigger: Notification Center setting 'mute_popups' is enabled.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  Typography,
  Alert,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  FormHelperText,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'System update completed', severity: 'info' as const },
  { id: '2', title: 'New comment on your post', severity: 'info' as const },
  { id: '3', title: 'Meeting in 15 minutes', severity: 'warning' as const },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(true); // Open by default
  const [mutePopups, setMutePopups] = useState(false);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (mutePopups && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [mutePopups, onSuccess]);

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Notification Center is open →
          </Typography>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="notif-drawer-primary"
      >
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notification Center
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={mutePopups}
                  onChange={(e) => setMutePopups(e.target.checked)}
                  data-testid="mute-popups-switch"
                />
              }
              label="Mute pop-up snackbars"
            />
            {mutePopups && (
              <FormHelperText>Pop-ups are muted</FormHelperText>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            {notifications.map((notif) => (
              <ListItem key={notif.id} sx={{ px: 0 }}>
                <Alert severity={notif.severity} sx={{ width: '100%' }}>
                  {notif.title}
                </Alert>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={emailSummaries}
                onChange={(e) => setEmailSummaries(e.target.checked)}
                data-testid="email-summaries-switch"
              />
            }
            label="Email me daily summaries"
          />
        </Box>
      </Drawer>
    </>
  );
}
