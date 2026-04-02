'use client';

/**
 * mentions_input-mui-T08: Top-right small: pick Fatima from a long list
 *
 * You are on a small "Quick mention" card anchored in the top-right of the viewport.
 * - Target component: one composite mentions input labeled Quick ping (MUI TextField).
 * - Scale: small and spacing compact (smaller padding and smaller Popper items).
 * - Typing @ opens a Popper dropdown that is scrollable and contains ~35 people.
 * - Several names start with "Fa…", e.g., Farah Ali, Fabian Costa, and Fatima Al-Sayed.
 * - Typing after '@' filters the list, but using a short query like '@f' still leaves many results, so scrolling may be necessary.
 *
 * Initial state: Quick ping is empty; no Popper is open.
 *
 * Success: Quick ping text must be exactly: "@Fatima Al-Sayed" (whitespace-normalized).
 *          Detected mentions must be exactly: [Fatima Al-Sayed].
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

// Long list with many F names
const USERS = [
  { id: 'fatima', label: 'Fatima Al-Sayed' },
  { id: 'farah', label: 'Farah Ali' },
  { id: 'fabian', label: 'Fabian Costa' },
  { id: 'fiona', label: 'Fiona Green' },
  { id: 'felix', label: 'Felix Brown' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'jun', label: 'Jun Ito' },
  { id: 'max', label: 'Max Wu' },
  { id: 'mia', label: 'Mia Davis' },
  { id: 'julia', label: 'Julia Stone' },
  { id: 'jordan', label: 'Jordan Lee' },
  { id: 'alex', label: 'Alex Thompson' },
  { id: 'beth', label: 'Beth Martin' },
  { id: 'carl', label: 'Carl Brown' },
  { id: 'diana', label: 'Diana Ross' },
  { id: 'eric', label: 'Eric Williams' },
  { id: 'greg', label: 'Greg Harris' },
  { id: 'helen', label: 'Helen Clark' },
  { id: 'ivan', label: 'Ivan Petrov' },
  { id: 'jane', label: 'Jane Smith' },
  { id: 'kevin', label: 'Kevin Chen' },
  { id: 'lisa', label: 'Lisa Wang' },
  { id: 'mike', label: 'Mike Johnson' },
  { id: 'nina', label: 'Nina Patel' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
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
    const targetText = '@Fatima Al-Sayed';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'fatima' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card sx={{ width: 280 }}>
      <CardHeader 
        title="Quick mention" 
        titleTypographyProps={{ variant: 'subtitle1' }}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1, pb: '12px !important' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          Quick ping: @Fatima Al-Sayed
        </Typography>
        <TextField
          ref={textFieldRef}
          size="small"
          placeholder="Type @..."
          value={value}
          onChange={handleChange}
          fullWidth
          data-testid="quick-ping-textfield"
          sx={{ '& .MuiInputBase-input': { fontSize: 13 } }}
        />
        <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }} role="listbox">
              <MenuList dense>
                {filteredUsers.map(user => (
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
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Typography>
      </CardContent>
    </Card>
  );
}
