'use client';

/**
 * mentions_input-mui-T09: Confusable names: Ann vs Anna vs Anne
 *
 * You are on a centered "Merge checklist" card.
 * - Target component: one composite mentions input labeled Checklist note.
 * - The suggestions Popper opens on @ and contains a short but highly confusable set of names:
 *   - Ann Lee
 *   - Anna Lee
 *   - Anne Lee
 *   - (plus a few others: Ava Chen, Noah Patel)
 * - Each suggestion shows the full name; the three options differ by only one letter.
 *
 * Initial state:
 * - Checklist note already contains the sentence with a blank gap:
 *   "Please check with  before merging."
 *   (There are two spaces between "with" and "before".)
 * - Detected mentions is empty.
 *
 * Goal: insert the correct Ann/Anna/Anne mention into the gap.
 *
 * Success: Checklist note must become exactly: "Please check with @Ann Lee before merging." (whitespace-normalized).
 *          Detected mentions must be exactly: [Ann Lee] (not Anna or Anne).
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'ann', label: 'Ann Lee' },
  { id: 'anna', label: 'Anna Lee' },
  { id: 'anne', label: 'Anne Lee' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Please check with  before merging.');
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
    const targetText = 'Please check with @Ann Lee before merging.';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'ann' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Merge checklist" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Checklist note: insert @Ann Lee in the blank.
        </Typography>
        <TextField
          ref={textFieldRef}
          label="Checklist note"
          placeholder="Type @ to mention"
          value={value}
          onChange={handleChange}
          multiline
          rows={2}
          fullWidth
          data-testid="checklist-note-textfield"
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
      </CardContent>
    </Card>
  );
}
