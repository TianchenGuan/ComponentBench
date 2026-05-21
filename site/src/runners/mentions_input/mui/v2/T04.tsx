'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'liam', label: 'Liam Ortiz' },
];

const REFERENCE_TEXT = 'Please ask @Maya Rivera to pair with @Liam Ortiz.';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, USERS);
  const [saved, setSaved] = useState(false);

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
      normalizeWhitespace(value) === REFERENCE_TEXT &&
      mentions.length === 2 &&
      mentions[0].id === 'maya' &&
      mentions[1].id === 'liam'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, value, mentions, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Card sx={{ width: 460, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Pairing Notes</Typography>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>Edit pairing note</Button>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}
      >
        <DialogTitle>Edit Pairing Note</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="caption" color="text.secondary">Reference:</Typography>
            <TextField
              size="small"
              value={REFERENCE_TEXT}
              fullWidth
              disabled
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Pairing note</Typography>
          <TextField
            ref={textFieldRef}
            label="Pairing note"
            placeholder="Type @ to mention"
            value={value}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            data-testid="pairing-note"
          />
          <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1500 }}>
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
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSaved(true)}>Save pairing</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
