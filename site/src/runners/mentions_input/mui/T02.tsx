'use client';

/**
 * mentions_input-mui-T02: MUI update: thank Maya
 *
 * You are on a "Release notes" card.
 * - Target component: one composite mentions input (MUI TextField multiline + Popper suggestions) labeled Update.
 * - Typing @ opens a Popper suggestions list with 8 people:
 *   Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks.
 * - Selecting an option inserts "@Full Name" at the caret and updates the "Detected mentions" helper text.
 * - Initial state: Update is empty.
 *
 * A grey, non-interactive preview box on the right shows "This is only a preview" (distractor).
 *
 * Success: Update field text must be exactly: "Thanks @Maya Rivera!" (whitespace-normalized).
 *          Detected mentions must be exactly: [Maya Rivera].
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
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
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
    const targetText = 'Thanks @Maya Rivera!';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'maya' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 550 }}>
      <CardHeader title="Release notes" />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Update: Thanks @Maya Rivera!
            </Typography>
            <TextField
              ref={textFieldRef}
              label="Update"
              placeholder="Type @ to mention"
              value={value}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              data-testid="update-textfield"
            />
            <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Paper elevation={3}>
                  <MenuList>
                    {filteredUsers.map(user => (
                      <MenuItem 
                        key={user.id} 
                        onClick={() => handleSelectMention(user)}
                        data-testid={`option-${user.id}`}
                      >
                        {user.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Paper>
              </ClickAwayListener>
            </Popper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
            </Typography>
          </Box>
          <Box sx={{ width: 150, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              This is only a preview
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
