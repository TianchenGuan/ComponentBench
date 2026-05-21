'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Box,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const USERS = [
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

const INITIAL_SUMMARY = 'Launch note drafted.';
const INITIAL_INTERNAL = 'Keep an internal copy.';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [summaryValue, setSummaryValue] = useState(INITIAL_SUMMARY);
  const [reviewerValue, setReviewerValue] = useState('Need review from  before launch.');
  const reviewerMentions = deriveMentionsFromText(reviewerValue, USERS);
  const [internalValue, setInternalValue] = useState(INITIAL_INTERNAL);
  const [saved, setSaved] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeField, setActiveField] = useState<'summary' | 'reviewer' | 'internal' | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const reviewerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const getRefForField = (field: 'summary' | 'reviewer' | 'internal') => {
    if (field === 'summary') return summaryRef;
    if (field === 'reviewer') return reviewerRef;
    return internalRef;
  };

  const handleChange = (field: 'summary' | 'reviewer' | 'internal') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;

    if (field === 'summary') setSummaryValue(newValue);
    else if (field === 'reviewer') setReviewerValue(newValue);
    else setInternalValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setActiveField(field);
        setAnchorEl(getRefForField(field).current);
        return;
      }
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null || !activeField) return;
    let currentValue = '';
    if (activeField === 'summary') currentValue = summaryValue;
    else if (activeField === 'reviewer') currentValue = reviewerValue;
    else currentValue = internalValue;

    const before = currentValue.substring(0, mentionStart);
    const after = currentValue.substring(mentionStart + 1 + filterText.length);
    const newValue = `${before}@${user.label}${after}`;

    if (activeField === 'reviewer') {
      setReviewerValue(newValue);
    } else if (activeField === 'summary') {
      setSummaryValue(newValue);
    } else {
      setInternalValue(newValue);
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveField(null);
  };

  const filtered = USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (!saved || hasSucceeded.current) return;
    if (
      normalizeWhitespace(reviewerValue) === 'Need review from @Ava Chen before launch.' &&
      reviewerMentions.length === 1 &&
      reviewerMentions[0].id === 'ava' &&
      normalizeWhitespace(summaryValue) === INITIAL_SUMMARY &&
      normalizeWhitespace(internalValue) === INITIAL_INTERNAL
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, reviewerValue, reviewerMentions, summaryValue, internalValue, onSuccess]);

  return (
    <Card sx={{ width: 520 }}>
      <CardHeader title="Dashboard Panel" />
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Summary</Typography>
        <TextField
          ref={summaryRef}
          label="Summary"
          value={summaryValue}
          onChange={handleChange('summary')}
          fullWidth
          size="small"
          data-testid="summary-field"
        />

        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>Reviewer ping</Typography>
        <TextField
          ref={reviewerRef}
          label="Reviewer ping"
          placeholder="Type @ to mention"
          value={reviewerValue}
          onChange={handleChange('reviewer')}
          fullWidth
          size="small"
          data-testid="reviewer-ping"
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Mentions: {reviewerMentions.length > 0 ? reviewerMentions.map(m => m.label).join(', ') : '(none)'}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>Internal ping</Typography>
        <TextField
          ref={internalRef}
          label="Internal ping"
          value={internalValue}
          onChange={handleChange('internal')}
          fullWidth
          size="small"
          data-testid="internal-ping"
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => setSaved(true)}>Apply panel</Button>
        </Box>

        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
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
      </CardContent>
    </Card>
  );
}
