'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Drawer, Box, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, EXTENDED_USERS, normalizeWhitespace } from '../../types';

const INITIAL_FOOTER = 'Footer stays unchanged.';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updateValue, setUpdateValue] = useState('');
  const updateMentions = deriveMentionsFromText(updateValue, EXTENDED_USERS);
  const [footerValue, setFooterValue] = useState(INITIAL_FOOTER);
  const [saved, setSaved] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeField, setActiveField] = useState<'update' | 'footer' | null>(null);
  const updateRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (field: 'update' | 'footer') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    if (field === 'update') setUpdateValue(newValue);
    else setFooterValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setActiveField(field);
        setAnchorEl(field === 'update' ? updateRef.current : footerRef.current);
        return;
      }
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const handleSelectMention = (user: (typeof EXTENDED_USERS)[0]) => {
    if (mentionStart === null || !activeField) return;
    const currentValue = activeField === 'update' ? updateValue : footerValue;
    const before = currentValue.substring(0, mentionStart);
    const after = currentValue.substring(mentionStart + 1 + filterText.length);
    const newValue = `${before}@${user.label}${after}`;

    if (activeField === 'update') {
      setUpdateValue(newValue);
    } else {
      setFooterValue(newValue);
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const filtered = EXTENDED_USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (!saved || hasSucceeded.current) return;
    if (
      normalizeWhitespace(updateValue) === 'FYI @Carlos Reyes and @Jun Ito.' &&
      updateMentions.length === 2 &&
      updateMentions[0].id === 'carlos' &&
      updateMentions[1].id === 'jun' &&
      normalizeWhitespace(footerValue) === INITIAL_FOOTER
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, updateValue, updateMentions, footerValue, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Updates" />
      <CardContent>
        <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Edit update</Button>
      </CardContent>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 420, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ p: 2, pb: 1 }}>Edit Update</Typography>
          <Divider />
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Update message</Typography>
            <TextField
              ref={updateRef}
              label="Update message"
              placeholder="Type @ to mention"
              value={updateValue}
              onChange={handleChange('update')}
              multiline
              rows={3}
              fullWidth
              data-testid="update-message"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mb: 2, display: 'block' }}>
              Mentions: {updateMentions.length > 0 ? updateMentions.map(m => m.label).join(', ') : '(none)'}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Footer note</Typography>
            <TextField
              ref={footerRef}
              label="Footer note"
              placeholder="Type @ to mention"
              value={footerValue}
              onChange={handleChange('footer')}
              multiline
              rows={3}
              fullWidth
              data-testid="footer-note"
            />
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setSaved(true)}>Save update</Button>
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
