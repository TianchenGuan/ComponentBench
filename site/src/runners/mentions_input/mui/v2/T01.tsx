'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Drawer, Box, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const USERS = [
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [publicValue, setPublicValue] = useState('');
  const publicMentions = deriveMentionsFromText(publicValue, USERS);
  const [internalValue, setInternalValue] = useState('Internal only: working on a fix.');
  const [saved, setSaved] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeField, setActiveField] = useState<'public' | 'internal' | null>(null);
  const publicRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (field: 'public' | 'internal') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    if (field === 'public') setPublicValue(newValue);
    else setInternalValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setActiveField(field);
        setAnchorEl(field === 'public' ? publicRef.current : internalRef.current);
        return;
      }
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null || !activeField) return;
    const currentValue = activeField === 'public' ? publicValue : internalValue;
    const before = currentValue.substring(0, mentionStart);
    const after = currentValue.substring(mentionStart + 1 + filterText.length);
    const newValue = `${before}@${user.label}${after}`;

    if (activeField === 'public') {
      setPublicValue(newValue);
    } else {
      setInternalValue(newValue);
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const filtered = USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (!saved || hasSucceeded.current) return;
    const norm = normalizeWhitespace(publicValue);
    const target = 'CC @Ava Chen and @Priya Singh.';
    if (
      norm === target &&
      publicMentions.length === 2 &&
      publicMentions[0].id === 'ava' &&
      publicMentions[1].id === 'priya' &&
      normalizeWhitespace(internalValue) === 'Internal only: working on a fix.'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, publicValue, publicMentions, internalValue, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Comments" />
      <CardContent>
        <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Edit comments</Button>
      </CardContent>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 420, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ p: 2, pb: 1 }}>Edit Comments</Typography>
          <Divider />
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Public comment</Typography>
            <TextField
              ref={publicRef}
              label="Public comment"
              placeholder="Type @ to mention"
              value={publicValue}
              onChange={handleChange('public')}
              multiline
              rows={3}
              fullWidth
              data-testid="public-comment"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mb: 2, display: 'block' }}>
              Mentions: {publicMentions.length > 0 ? publicMentions.map(m => m.label).join(', ') : '(none)'}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Internal comment</Typography>
            <TextField
              ref={internalRef}
              label="Internal comment"
              placeholder="Type @ to mention"
              value={internalValue}
              onChange={handleChange('internal')}
              multiline
              rows={3}
              fullWidth
              data-testid="internal-comment"
            />
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setSaved(true)}>Apply comment</Button>
          </Box>
        </Box>
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1400 }}>
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
      </Drawer>
    </Card>
  );
}
