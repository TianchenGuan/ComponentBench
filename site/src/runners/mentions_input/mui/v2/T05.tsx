'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Box,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const USERS = [
  { id: 'noah', label: 'Noah Patel' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'liam', label: 'Liam Ortiz' },
];

const INITIAL_BACKUP = 'No backup reviewer yet.';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [reviewerValue, setReviewerValue] = useState('Thanks @Noah Patel!');
  const reviewerMentions = deriveMentionsFromText(reviewerValue, USERS);
  const [backupValue, setBackupValue] = useState(INITIAL_BACKUP);
  const [saved, setSaved] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeField, setActiveField] = useState<'reviewer' | 'backup' | null>(null);
  const reviewerRef = useRef<HTMLDivElement>(null);
  const backupRef = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (field: 'reviewer' | 'backup') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    if (field === 'reviewer') setReviewerValue(newValue);
    else setBackupValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setActiveField(field);
        setAnchorEl(field === 'reviewer' ? reviewerRef.current : backupRef.current);
        return;
      }
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null || !activeField) return;
    const currentValue = activeField === 'reviewer' ? reviewerValue : backupValue;
    const before = currentValue.substring(0, mentionStart);
    const after = currentValue.substring(mentionStart + 1 + filterText.length);
    const newValue = `${before}@${user.label}${after}`;

    if (activeField === 'reviewer') {
      setReviewerValue(newValue);
    } else {
      setBackupValue(newValue);
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const filtered = USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (!saved || hasSucceeded.current) return;
    const norm = normalizeWhitespace(reviewerValue);
    const target = 'Thanks @Maya Rivera — please loop @Liam Ortiz.';
    const hasMaya = reviewerMentions.some(m => m.id === 'maya');
    const hasLiam = reviewerMentions.some(m => m.id === 'liam');
    if (
      norm === target &&
      hasMaya && hasLiam &&
      normalizeWhitespace(backupValue) === INITIAL_BACKUP
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, reviewerValue, reviewerMentions, backupValue, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Review" />
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Reviewer note</Typography>
        <TextField
          ref={reviewerRef}
          label="Reviewer note"
          placeholder="Type @ to mention"
          value={reviewerValue}
          onChange={handleChange('reviewer')}
          multiline
          rows={2}
          fullWidth
          data-testid="reviewer-note"
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mb: 2, display: 'block' }}>
          Mentions: {reviewerMentions.length > 0 ? reviewerMentions.map(m => m.label).join(', ') : '(none)'}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Backup note</Typography>
        <TextField
          ref={backupRef}
          label="Backup note"
          placeholder="Type @ to mention"
          value={backupValue}
          onChange={handleChange('backup')}
          multiline
          rows={2}
          fullWidth
          data-testid="backup-note"
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => setSaved(true)}>Save note</Button>
        </Box>

        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={() => { setAnchorEl(null); setActiveField(null); }}>
            <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
              <MenuList>
                {filtered.map(user => (
                  <MenuItem key={user.id} onClick={() => handleSelectMention(user)} data-testid={`option-${user.id}`}>
                    {user.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </CardContent>
    </Card>
  );
}
