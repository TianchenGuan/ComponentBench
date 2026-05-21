'use client';

/**
 * mentions_input-mui-T01: MUI comment: greet Ava
 *
 * You are on a centered "Comment" card built with Material UI.
 * - Target component: a composite mentions input implemented using:
 *   - MUI TextField (multiline) as the text entry
 *   - An anchored MUI Popper that renders a Menu/List of suggestions when '@' is typed
 * - The field label is Comment and the placeholder says "Type @ to mention".
 * - When the caret is in the field and you type @, the Popper opens below the field, listing 6 teammates:
 *   - Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim
 * - Clicking a suggestion inserts a mention token "@Full Name" into the text.
 * - A small helper line under the TextField reads "Detected mentions: …" and updates based on selections.
 * - Initial state: Comment is empty; Popper is closed.
 *
 * No other interactive elements exist.
 *
 * Success: Comment field text must be exactly: "Hi @Ava Chen" (whitespace-normalized).
 *          Detected mentions must be exactly: [Ava Chen].
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
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
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

    // Check if we should open the mention popup
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Only show popup if @ is at start or preceded by space, and no space after @
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
    const targetText = 'Hi @Ava Chen';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'ava' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Comment" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Comment (supports @mentions). Target: Hi @Ava Chen
        </Typography>
        <TextField
          ref={textFieldRef}
          label="Comment"
          placeholder="Type @ to mention"
          value={value}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          data-testid="comment-textfield"
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
