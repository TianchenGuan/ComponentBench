'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Box,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, EXTENDED_USERS, normalizeWhitespace } from '../../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, EXTENDED_USERS);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [saved, setSaved] = useState(false);
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

  const handleSelectMention = (user: (typeof EXTENDED_USERS)[0]) => {
    if (mentionStart === null) return;
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + 1 + filterText.length);
    setValue(`${before}@${user.label}${after}`);
    setAnchorEl(null);
    setMentionStart(null);
  };

  const filtered = EXTENDED_USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (!saved || hasSucceeded.current) return;
    if (
      normalizeWhitespace(value) === '@Fatima Al-Sayed' &&
      mentions.length === 1 &&
      mentions[0].id === 'fatima'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, value, mentions, onSuccess]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
      <Card sx={{ width: 280 }}>
        <CardHeader
          title="Settings"
          titleTypographyProps={{ variant: 'subtitle1' }}
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 1, pb: '12px !important' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Quick ping
          </Typography>
          <TextField
            ref={textFieldRef}
            size="small"
            label="Quick ping"
            placeholder="Type @..."
            value={value}
            onChange={handleChange}
            fullWidth
            data-testid="quick-ping-textfield"
            sx={{ '& .MuiInputBase-input': { fontSize: 13 } }}
          />
          <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
            <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
              <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
                <MenuList dense>
                  {filtered.map(user => (
                    <MenuItem
                      key={user.id}
                      onClick={() => handleSelectMention(user)}
                      data-testid={`option-${user.id}`}
                      sx={{ fontSize: 13 }}
                    >
                      {user.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </ClickAwayListener>
          </Popper>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: 11 }}>
            Mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
          </Typography>

          <TextField
            size="small"
            label="Audit log"
            value="Last edited 2024-12-01 by admin"
            fullWidth
            disabled
            sx={{ mt: 2, '& .MuiInputBase-input': { fontSize: 12 } }}
          />

          <Box sx={{ mt: 1.5 }}>
            <Button size="small" variant="contained" onClick={() => setSaved(true)}>
              Apply ping
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
