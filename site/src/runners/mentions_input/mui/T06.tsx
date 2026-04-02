'use client';

/**
 * mentions_input-mui-T06: Public comment: CC two teammates
 *
 * You are on a "Two-part comment" card with two similar inputs.
 *
 * Target components (E6=2):
 * - Public comment — composite mentions input (MUI TextField + Popper)
 * - Internal comment — composite mentions input (MUI TextField + Popper)
 *
 * Both:
 * - Support @mentions via a Popper dropdown.
 * - Share the same 9-person list: Ava Chen, Priya Singh, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks.
 * - Show their own "Detected mentions" helper line.
 *
 * Initial state:
 * - Public comment is empty.
 * - Internal comment already contains: "Internal only: working on a fix." (no mentions).
 *
 * Goal targets the Public comment field only.
 *
 * Success: Public comment text must be exactly: "CC @Ava Chen and @Priya Singh" (whitespace-normalized).
 *          Public comment detected mentions must be exactly: [Ava Chen, Priya Singh].
 *          Internal comment must remain unchanged.
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
  { id: 'priya', label: 'Priya Singh' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  // Public comment state (target)
  const [publicValue, setPublicValue] = useState('');
  const publicMentions = deriveMentionsFromText(publicValue, USERS);
  const [publicAnchorEl, setPublicAnchorEl] = useState<HTMLElement | null>(null);
  const [publicMentionStart, setPublicMentionStart] = useState<number | null>(null);
  const [publicFilterText, setPublicFilterText] = useState('');
  const publicRef = useRef<HTMLDivElement>(null);

  // Internal comment state (should not change)
  const [internalValue] = useState('Internal only: working on a fix.');
  const internalMentions = deriveMentionsFromText(internalValue, USERS);

  const hasSucceeded = useRef(false);
  const isPublicOpen = Boolean(publicAnchorEl);

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setPublicValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setPublicMentionStart(lastAtIndex);
        setPublicFilterText(textAfterAt.toLowerCase());
        setPublicAnchorEl(publicRef.current);
        return;
      }
    }
    
    setPublicAnchorEl(null);
    setPublicMentionStart(null);
  };

  const handlePublicSelectMention = (user: typeof USERS[0]) => {
    if (publicMentionStart === null) return;
    
    const beforeMention = publicValue.substring(0, publicMentionStart);
    const afterCursor = publicValue.substring(publicMentionStart + 1 + publicFilterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setPublicValue(newValue);
    setPublicAnchorEl(null);
    setPublicMentionStart(null);
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(publicFilterText)
  );

  useEffect(() => {
    const normalizedText = normalizeWhitespace(publicValue);
    const targetText = 'CC @Ava Chen and @Priya Singh';
    
    if (
      normalizedText === targetText &&
      publicMentions.length === 2 &&
      publicMentions[0].id === 'ava' &&
      publicMentions[1].id === 'priya' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [publicValue, publicMentions, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Two-part comment" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Public comment: CC @Ava Chen and @Priya Singh
        </Typography>

        {/* Public comment (target) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Public comment</Typography>
          <TextField
            ref={publicRef}
            placeholder="Type @ to mention"
            value={publicValue}
            onChange={handlePublicChange}
            multiline
            rows={2}
            fullWidth
            data-testid="public-comment-textfield"
          />
          <Popper open={isPublicOpen} anchorEl={publicAnchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
            <ClickAwayListener onClickAway={() => setPublicAnchorEl(null)}>
              <Paper elevation={3}>
                <MenuList>
                  {filteredUsers.map(user => (
                    <MenuItem 
                      key={user.id} 
                      onClick={() => handlePublicSelectMention(user)}
                      data-testid={`public-option-${user.id}`}
                    >
                      {user.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </ClickAwayListener>
          </Popper>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Detected mentions: {publicMentions.length > 0 ? publicMentions.map(m => m.label).join(', ') : '(none)'}
          </Typography>
        </Box>

        {/* Internal comment (read-only) */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Internal comment</Typography>
          <TextField
            placeholder="Type @ to mention"
            value={internalValue}
            multiline
            rows={2}
            fullWidth
            disabled
            data-testid="internal-comment-textfield"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Detected mentions: {internalMentions.length > 0 ? internalMentions.map(m => m.label).join(', ') : '(none)'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
