'use client';

/**
 * mentions_input-mui-T04: Bug triage: assign to Sophia
 *
 * You are in a "Bug triage" form section (low clutter).
 *
 * Form fields (distractors):
 * - Title (read-only text input, already filled)
 * - Severity (select)
 * - A non-functional "Create" button
 *
 * Target component:
 * - A composite mentions input labeled Assignee (MUI TextField multiline but visually single-line).
 * - Typing @ opens a Popper with a scrollable list of about 15 people.
 * - The list includes similar "So…" names, e.g., Sofia Navarro and Sophia Nguyen.
 * - The Popper filters as you type after '@'.
 *
 * Initial state:
 * - Assignee field is empty.
 * - Popper is closed.
 *
 * Success: Assignee field must equal exactly: "@Sophia Nguyen" (whitespace-normalized).
 *          Detected mentions must be exactly: [Sophia Nguyen].
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Select, FormControl, InputLabel, Button, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'sofia', label: 'Sofia Navarro' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'jun', label: 'Jun Ito' },
  { id: 'max', label: 'Max Wu' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
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
    const targetText = '@Sophia Nguyen';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'sophia' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Bug triage" />
      <CardContent>
        {/* Distractor fields */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Title"
            value="Login button unresponsive on mobile"
            disabled
            fullWidth
            size="small"
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }} disabled>
            <InputLabel>Severity</InputLabel>
            <Select value="high" label="Severity">
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Target field */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Assignee: @Sophia Nguyen
        </Typography>
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
        <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
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

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" disabled sx={{ opacity: 0.5 }}>Create</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
