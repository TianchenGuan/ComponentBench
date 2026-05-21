'use client';

/**
 * notification_center-mui-T05: Archive three selected notifications
 *
 * setup_description:
 * Baseline isolated card with an inline Notification Center.
 * Each notification row has a left-side checkbox for multi-selection and an Alert-style body (icon + title).
 * 
 * Target notifications and ids:
 *   - "Trial expiring" (id 'trial_expiring')
 *   - "Storage limit reached" (id 'storage_limit')
 *   - "Weekly report ready" (id 'weekly_report_ready')
 * 
 * Initial state:
 *   - All three targets are in the All view (not archived).
 *   - No items are selected.
 * 
 * When one or more checkboxes are selected, a sticky bulk action toolbar appears above the list with buttons:
 *   - "Archive selected"
 *   - "Mark as read"
 *   - "Cancel"
 * 
 * Distractors: there is also a per-row overflow menu (⋮) offering "Archive" and "Delete" for single items; it is not required but could be used.
 * Feedback: archiving removes the selected items from the All list and increases the Archived count indicator.
 *
 * success_trigger: Notifications 'trial_expiring', 'storage_limit', and 'weekly_report_ready' are archived.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  archived: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'trial_expiring', title: 'Trial expiring', severity: 'warning', archived: false },
  { id: 'storage_limit', title: 'Storage limit reached', severity: 'error', archived: false },
  { id: 'weekly_report_ready', title: 'Weekly report ready', severity: 'info', archived: false },
  { id: 'weekly_report_delayed', title: 'Weekly report delayed', severity: 'warning', archived: false },
  { id: 'payment_received', title: 'Payment received', severity: 'success', archived: false },
  { id: 'maintenance_scheduled', title: 'Maintenance scheduled', severity: 'info', archived: false },
  { id: 'new_feature', title: 'New feature available', severity: 'info', archived: false },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | { el: HTMLElement; id: string }>(null);
  const successCalledRef = useRef(false);

  const activeNotifications = notifications.filter(n => !n.archived);
  const archivedCount = notifications.filter(n => n.archived).length;

  useEffect(() => {
    const trialExpiring = notifications.find(n => n.id === 'trial_expiring');
    const storageLimit = notifications.find(n => n.id === 'storage_limit');
    const weeklyReportReady = notifications.find(n => n.id === 'weekly_report_ready');

    if (
      trialExpiring?.archived &&
      storageLimit?.archived &&
      weeklyReportReady?.archived &&
      !successCalledRef.current
    ) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleArchiveSelected = () => {
    setNotifications(prev =>
      prev.map(n => selectedIds.includes(n.id) ? { ...n, archived: true } : n)
    );
    setSelectedIds([]);
  };

  const handleArchiveSingle = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, archived: true } : n)
    );
    setMenuAnchor(null);
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span>Notification Center</span>
            <Typography variant="body2" color="text.secondary">
              Archived: {archivedCount}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        {selectedIds.length > 0 && (
          <Box
            sx={{
              p: 1,
              mb: 2,
              bgcolor: 'action.selected',
              borderRadius: 1,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="body2">{selectedIds.length} selected</Typography>
            <Button size="small" variant="contained" onClick={handleArchiveSelected}>
              Archive selected
            </Button>
            <Button size="small">Mark as read</Button>
            <Button size="small" onClick={() => setSelectedIds([])}>
              Cancel
            </Button>
          </Box>
        )}

        <List disablePadding>
          {activeNotifications.map((notif) => (
            <ListItem
              key={notif.id}
              data-notif-id={notif.id}
              sx={{ px: 0 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => setMenuAnchor({ el: e.currentTarget, id: notif.id })}
                  aria-label="More options"
                >
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <Checkbox
                checked={selectedIds.includes(notif.id)}
                onChange={() => toggleSelect(notif.id)}
                data-testid={`checkbox-${notif.id}`}
              />
              <Alert severity={notif.severity} sx={{ flex: 1 }}>
                {notif.title}
              </Alert>
            </ListItem>
          ))}
        </List>

        <Menu
          anchorEl={menuAnchor?.el}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => menuAnchor && handleArchiveSingle(menuAnchor.id)}>
            Archive
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>Delete</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
