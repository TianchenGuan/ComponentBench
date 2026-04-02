'use client';

/**
 * mentions_input-mui-T07: Dark theme: match reference with two mentions
 *
 * You are on a dark-theme "Copy this message" card built with MUI.
 * - Target component: a composite mentions input labeled Message (MUI TextField multiline).
 * - Typing @ opens a Popper suggestions list (8 options): Emma Johnson, Ethan Brooks, Liam Ortiz, Noah Patel, Ava Chen, Maya Rivera, Olivia Kim, Sophia Nguyen.
 * - Right next to the input there is a Reference area:
 *   - A visual chat bubble showing the desired sentence with highlighted mentions (visual).
 *   - Under the bubble, a small monospace line shows the exact text (mixed guidance).
 *
 * Initial state: Message is empty; Popper closed.
 *
 * Success: Message must match the reference exactly: "Reviewed by @Emma Johnson — ping @Ethan Brooks if blocked." (whitespace-normalized, dash preserved).
 *          Detected mentions must be exactly: [Emma Johnson, Ethan Brooks].
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, USERS);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const textFieldRef = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const isOpen = Boolean(anchorEl);

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
    
    const beforeMention = value.substring(0, mentionStart);
    const afterCursor = value.substring(mentionStart + 1 + filterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setValue(newValue);
    setAnchorEl(null);
    setMentionStart(null);
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(filterText)
  );

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = 'Reviewed by @Emma Johnson — ping @Ethan Brooks if blocked.';
    
    if (
      normalizedText === targetText &&
      mentions.length === 2 &&
      mentions[0].id === 'emma' &&
      mentions[1].id === 'ethan' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 650, bgcolor: '#1e1e1e', color: '#fff' }}>
      <CardHeader title="Copy this message" sx={{ color: '#fff', borderBottom: '1px solid #333' }} />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 2, color: '#aaa' }}>
          Reference shown (dark theme). Match it in Message.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Message input */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#fff' }}>Message</Typography>
            <TextField
              ref={textFieldRef}
              placeholder="Type @ to mention"
              value={value}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              data-testid="message-textfield"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputBase-input::placeholder': { color: '#888', opacity: 1 },
              }}
            />
            <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Paper elevation={3} sx={{ bgcolor: '#333' }}>
                  <MenuList>
                    {filteredUsers.map(user => (
                      <MenuItem 
                        key={user.id} 
                        onClick={() => handleSelectMention(user)}
                        data-testid={`option-${user.id}`}
                        sx={{ color: '#fff', '&:hover': { bgcolor: '#444' } }}
                      >
                        {user.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Paper>
              </ClickAwayListener>
            </Popper>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#888' }}>
              Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
            </Typography>
          </Box>

          {/* Reference area */}
          <Box sx={{ width: 240 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#fff' }}>Reference</Typography>
            <Box
              sx={{
                bgcolor: '#333',
                borderRadius: 2,
                p: 2,
                mb: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: '#fff', lineHeight: 1.6 }}>
                Reviewed by{' '}
                <Box component="span" sx={{ bgcolor: '#444', borderRadius: 1, px: 0.5 }}>
                  @Emma Johnson
                </Box>
                {' '}— ping{' '}
                <Box component="span" sx={{ bgcolor: '#444', borderRadius: 1, px: 0.5 }}>
                  @Ethan Brooks
                </Box>
                {' '}if blocked.
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontFamily: 'monospace',
                color: '#888',
                fontSize: 10,
              }}
            >
              Reviewed by @Emma Johnson — ping @Ethan Brooks if blocked.
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
