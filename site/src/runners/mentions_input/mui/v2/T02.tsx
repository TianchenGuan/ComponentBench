'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Button, Table, TableHead, TableBody, TableRow,
  TableCell,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const SONYA = { id: 'sonya', label: 'Sonya Brooks' };

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'sofia', label: 'Sofia Navarro' },
  SONYA,
  { id: 'liam', label: 'Liam Ortiz' },
];

interface RowData {
  ticket: string;
  note: string;
  saved: boolean;
}

const INITIAL_ROWS: RowData[] = [
  { ticket: '#101', note: 'Waiting on rollback owner.', saved: false },
  { ticket: '#102', note: 'Please ask  to review deployment.', saved: false },
  { ticket: '#103', note: 'Can close after logs are archived.', saved: false },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>(INITIAL_ROWS);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const rowRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const hasSucceeded = useRef(false);

  const handleChange = (rowIdx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;

    setRows(prev => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], note: newValue };
      return updated;
    });

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setActiveRow(rowIdx);
        setAnchorEl(rowRefs[rowIdx].current);
        return;
      }
    }
    setAnchorEl(null);
    setMentionStart(null);
    setActiveRow(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null || activeRow === null) return;
    const currentNote = rows[activeRow].note;
    const before = currentNote.substring(0, mentionStart);
    const after = currentNote.substring(mentionStart + 1 + filterText.length);
    const newNote = `${before}@${user.label}${after}`;

    setRows(prev => {
      const updated = [...prev];
      updated[activeRow] = {
        ...updated[activeRow],
        note: newNote,
      };
      return updated;
    });
    setAnchorEl(null);
    setMentionStart(null);
    setActiveRow(null);
  };

  const handleSaveRow = (rowIdx: number) => {
    setRows(prev => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], saved: true };
      return updated;
    });
  };

  const filtered = USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (hasSucceeded.current) return;
    const r102 = rows[1];
    const r102Mentions = deriveMentionsFromText(r102.note, USERS);
    if (
      r102.saved &&
      normalizeWhitespace(r102.note) === 'Please ask @Sophia Nguyen to review deployment.' &&
      r102Mentions.length === 1 &&
      r102Mentions[0].id === 'sophia' &&
      rows[0].note === INITIAL_ROWS[0].note &&
      rows[2].note === INITIAL_ROWS[2].note
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <Card sx={{ width: 700 }}>
      <CardHeader title="Incidents" />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ticket</TableCell>
              <TableCell>Note</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.ticket}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Ticket {row.ticket}</TableCell>
                <TableCell>
                  <TextField
                    ref={rowRefs[idx]}
                    size="small"
                    placeholder="Type @ to mention"
                    value={row.note}
                    onChange={handleChange(idx)}
                    fullWidth
                    data-testid={`ticket-${row.ticket}-note`}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSaveRow(idx)}
                    disabled={row.saved}
                  >
                    {row.saved ? 'Saved' : 'Save'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={() => { setAnchorEl(null); setActiveRow(null); }}>
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
