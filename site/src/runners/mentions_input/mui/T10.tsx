'use client';

/**
 * mentions_input-mui-T10: Incident dashboard: match resolution summary
 *
 * You are on a busy "Incident dashboard" (high clutter).
 *
 * Dashboard elements (distractors):
 * - Left sidebar with nav items (non-functional)
 * - Header with search box and 3 icon buttons
 * - Multiple cards: "Timeline", "Metrics", "Participants" (static lists), etc.
 *
 * Target components (E6=3):
 * There are three composite mentions inputs (MUI TextField + Popper) on different cards:
 * 1) Public reply
 * 2) Internal note
 * 3) Resolution summary  ← target instance
 *
 * Each input:
 * - Supports @mentions with the same suggestions list (about 12 people): Ava Chen, Maya Rivera, Priya Singh, Noah Patel, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks, Isabella Garcia, Daniel Park, Carlos Reyes.
 * - Shows "Detected mentions" below it.
 *
 * Guidance (mixed):
 * - On the right side of the dashboard there is a "Reference summary" panel that shows the exact sentence to copy:
 *   - It is displayed visually as a paragraph, and also as a selectable plain-text line under it.
 *
 * Initial state:
 * - Public reply has some placeholder text (not to be changed).
 * - Internal note has placeholder (not to be changed).
 * - Resolution summary is empty.
 *
 * Success: Only the Resolution summary input must be changed.
 *          Resolution summary text must match the reference exactly: "Resolved with help from @Ava Chen, @Maya Rivera, and @Priya Singh." (whitespace-normalized).
 *          Resolution summary detected mentions must be exactly: [Ava Chen, Maya Rivera, Priya Singh] in order.
 *          Public reply and Internal note must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Box, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import type { TaskComponentProps, Mention } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  // Public reply and Internal note (should not change)
  const [publicValue] = useState('We are investigating the issue.');
  const publicMentions = deriveMentionsFromText(publicValue, USERS);
  const [internalValue] = useState('Root cause identified: config error.');
  const internalMentions = deriveMentionsFromText(internalValue, USERS);

  // Resolution summary (target)
  const [resolutionValue, setResolutionValue] = useState('');
  const resolutionMentions = deriveMentionsFromText(resolutionValue, USERS);
  const [resolutionAnchorEl, setResolutionAnchorEl] = useState<HTMLElement | null>(null);
  const [resolutionMentionStart, setResolutionMentionStart] = useState<number | null>(null);
  const [resolutionFilterText, setResolutionFilterText] = useState('');
  const resolutionRef = useRef<HTMLDivElement>(null);

  const hasSucceeded = useRef(false);
  const isResolutionOpen = Boolean(resolutionAnchorEl);

  const handleResolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setResolutionValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setResolutionMentionStart(lastAtIndex);
        setResolutionFilterText(textAfterAt.toLowerCase());
        setResolutionAnchorEl(resolutionRef.current);
        return;
      }
    }
    
    setResolutionAnchorEl(null);
    setResolutionMentionStart(null);
  };

  const handleResolutionSelectMention = (user: typeof USERS[0]) => {
    if (resolutionMentionStart === null) return;
    
    const beforeMention = resolutionValue.substring(0, resolutionMentionStart);
    const afterCursor = resolutionValue.substring(resolutionMentionStart + 1 + resolutionFilterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setResolutionValue(newValue);
    setResolutionAnchorEl(null);
    setResolutionMentionStart(null);
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(resolutionFilterText)
  );

  useEffect(() => {
    if (hasSucceeded.current) return;
    const normalizedText = normalizeWhitespace(resolutionValue);
    const targetTexts = [
      'Resolved with help from @Ava Chen, @Maya Rivera, and @Priya Singh.',
      'Resolved with help from @Ava Chen, @Maya Rivera and @Priya Singh.',
    ];

    if (!targetTexts.includes(normalizedText)) return;

    const requiredIds = new Set(['ava', 'maya', 'priya']);
    const mentionIds = new Set(resolutionMentions.map(m => m.id));
    const mentionsOk = requiredIds.size === mentionIds.size &&
      Array.from(requiredIds).every(id => mentionIds.has(id));

    if (mentionsOk) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [resolutionValue, resolutionMentions, onSuccess]);

  const renderMentionsField = (
    label: string,
    value: string,
    mentions: Mention[],
    disabled: boolean,
    testId: string,
    textFieldRef?: React.RefObject<HTMLDivElement | null>,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label}</Typography>
      <TextField
        ref={textFieldRef as React.RefObject<HTMLDivElement>}
        size="small"
        placeholder="Type @ to mention"
        value={value}
        onChange={onChange}
        multiline
        rows={2}
        fullWidth
        disabled={disabled}
        data-testid={testId}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: 900, display: 'flex', gap: 2 }}>
      {/* Left sidebar (distractor) */}
      <Box sx={{ width: 150, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Navigation</Typography>
        <List dense>
          <ListItem sx={{ py: 0.25 }}><ListItemText primary="Overview" primaryTypographyProps={{ fontSize: 12 }} /></ListItem>
          <ListItem sx={{ py: 0.25 }}><ListItemText primary="Incidents" primaryTypographyProps={{ fontSize: 12 }} /></ListItem>
          <ListItem sx={{ py: 0.25 }}><ListItemText primary="Reports" primaryTypographyProps={{ fontSize: 12 }} /></ListItem>
          <ListItem sx={{ py: 0.25 }}><ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 12 }} /></ListItem>
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Incident Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField size="small" placeholder="Search..." InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }} sx={{ width: 150 }} disabled />
            <IconButton disabled><NotificationsIcon /></IconButton>
            <IconButton disabled><SettingsIcon /></IconButton>
          </Box>
        </Box>

        {/* Cards grid */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Static cards (distractors) */}
          <Card sx={{ width: 200 }}>
            <CardHeader title="Timeline" titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 1 }}>
              <Typography variant="caption">10:30 - Incident opened</Typography><br />
              <Typography variant="caption">10:45 - Team assigned</Typography><br />
              <Typography variant="caption">11:20 - Root cause found</Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 180 }}>
            <CardHeader title="Metrics" titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 1 }}>
              <Typography variant="caption">MTTR: 52 min</Typography><br />
              <Typography variant="caption">Severity: P1</Typography><br />
              <Typography variant="caption">Impact: 1.2k users</Typography>
            </CardContent>
          </Card>

          {/* Public reply (disabled) */}
          <Card sx={{ width: 280 }}>
            <CardHeader title="Public reply" titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 1 }}>
              {renderMentionsField('', publicValue, publicMentions, true, 'mentions-public')}
            </CardContent>
          </Card>

          {/* Internal note (disabled) */}
          <Card sx={{ width: 280 }}>
            <CardHeader title="Internal note" titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 1 }}>
              {renderMentionsField('', internalValue, internalMentions, true, 'mentions-internal')}
            </CardContent>
          </Card>

          {/* Resolution summary (target) */}
          <Card sx={{ width: 280 }}>
            <CardHeader title="Resolution summary" titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 1 }}>
              {renderMentionsField('', resolutionValue, resolutionMentions, false, 'mentions-resolution', resolutionRef, handleResolutionChange)}
              <Popper open={isResolutionOpen} anchorEl={resolutionAnchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
                <ClickAwayListener onClickAway={() => setResolutionAnchorEl(null)}>
                  <Paper elevation={3} sx={{ maxHeight: 150, overflow: 'auto' }}>
                    <MenuList dense>
                      {filteredUsers.map(user => (
                        <MenuItem 
                          key={user.id} 
                          onClick={() => handleResolutionSelectMention(user)}
                          data-testid={`resolution-option-${user.id}`}
                        >
                          {user.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Reference panel */}
      <Box sx={{ width: 200, bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Reference summary</Typography>
        <Box sx={{ bgcolor: '#fff', p: 1.5, borderRadius: 1, border: '1px solid #eee', mb: 1 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            Resolved with help from{' '}
            <Box component="span" sx={{ bgcolor: '#e3f2fd', borderRadius: 0.5, px: 0.5 }}>@Ava Chen</Box>
            ,{' '}
            <Box component="span" sx={{ bgcolor: '#e3f2fd', borderRadius: 0.5, px: 0.5 }}>@Maya Rivera</Box>
            , and{' '}
            <Box component="span" sx={{ bgcolor: '#e3f2fd', borderRadius: 0.5, px: 0.5 }}>@Priya Singh</Box>
            .
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: 9, color: '#666', wordBreak: 'break-word' }}>
          Resolved with help from @Ava Chen, @Maya Rivera, and @Priya Singh.
        </Typography>
      </Box>
    </Box>
  );
}
