'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Box, Chip, FormControl, InputLabel, Select,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const SONYA = { id: 'sonya', label: 'Sonya Brooks' };

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'sofia', label: 'Sofia Navarro' },
  SONYA,
  { id: 'liam', label: 'Liam Ortiz' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, USERS);
  const [saved, setSaved] = useState(false);
  const [severity, setSeverity] = useState('medium');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const textFieldRef = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setAnchorEl(textFieldRef.current);
        return;
      }
    }
    setAnchorEl(null);
    setMentionStart(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null) return;
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + 1 + filterText.length);
    setValue(`${before}@${user.label}${after}`);
    setAnchorEl(null);
    setMentionStart(null);
  };

  const filtered = USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (!saved || hasSucceeded.current) return;
    if (
      normalizeWhitespace(value) === '@Sophia Nguyen' &&
      mentions.length === 1 &&
      mentions[0].id === 'sophia'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 460 }}>
      <CardHeader title="Settings" />
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Assignee</Typography>
        <TextField
          ref={textFieldRef}
          label="Assignee"
          placeholder="Type @ to assign"
          value={value}
          onChange={handleChange}
          fullWidth
          size="small"
          data-testid="assignee-textfield"
        />
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mb: 2, display: 'block' }}>
          Mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150, mt: 1 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={severity}
            label="Severity"
            onChange={(e) => setSeverity(e.target.value)}
            native
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Active" color="success" size="small" />
          <Chip label="Triaged" variant="outlined" size="small" />
          <Chip label="P1" color="error" size="small" />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => setSaved(true)}>Save assignee</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
