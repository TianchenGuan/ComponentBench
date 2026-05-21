'use client';

/**
 * mentions_input-mui-T05: Tickets table: open suggestions in the correct row
 *
 * You are looking at a small "Tickets" table (medium clutter because the table has several columns).
 *
 * Table:
 * - 2 rows: Ticket #101 and Ticket #102
 * - Columns: ID (static), Status (chip), Owner (static), Note (this is the target column)
 *
 * Target components (E6=2):
 * - Each row's Note cell contains a composite mentions input (MUI TextField styled to fit in a table cell).
 * - Both Note inputs support typing @ to open a Popper suggestions dropdown.
 * - Suggestions list (10 options) includes: Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks, Isabella Garcia, Priya Singh.
 *
 * Initial state:
 * - Both Note fields are empty and no Popper is open.
 *
 * Goal focuses on opening the suggestions overlay in the correct row without selecting anyone.
 *
 * Success: In the Ticket #102 – Note mentions input, the suggestions Popper must be open/visible.
 *          The query must be exactly '@' (no additional filter characters).
 *          No mention should be inserted into Ticket #102's Note (Detected mentions stays empty).
 *          Ticket #101's Note must remain untouched (still empty and no open Popper for that row).
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, CardHeader,
  TextField, Popper, Paper, MenuList, MenuItem,
  Typography, ClickAwayListener, Table, TableHead, TableBody,
  TableRow, TableCell, Chip
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { deriveMentionsFromText } from '../types';

const USERS = [
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
];

interface RowState {
  value: string;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [row101, setRow101] = useState<RowState>({ value: '', anchorEl: null, isOpen: false });
  const [row102, setRow102] = useState<RowState>({ value: '', anchorEl: null, isOpen: false });
  const row101Mentions = deriveMentionsFromText(row101.value, USERS);
  const row102Mentions = deriveMentionsFromText(row102.value, USERS);
  const ref101 = useRef<HTMLDivElement>(null);
  const ref102 = useRef<HTMLDivElement>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (rowId: '101' | '102') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    const setRow = rowId === '101' ? setRow101 : setRow102;
    const refEl = rowId === '101' ? ref101.current : ref102.current;

    setRow(prev => {
      const textBeforeCursor = newValue.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
        if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
          return { ...prev, value: newValue, anchorEl: refEl, isOpen: true };
        }
      }
      
      return { ...prev, value: newValue, anchorEl: null, isOpen: false };
    });
  };

  const handleSelectMention = (rowId: '101' | '102', user: typeof USERS[0]) => {
    const setRow = rowId === '101' ? setRow101 : setRow102;
    const row = rowId === '101' ? row101 : row102;
    
    const lastAtIndex = row.value.lastIndexOf('@');
    if (lastAtIndex === -1) return;
    
    const beforeMention = row.value.substring(0, lastAtIndex);
    const newValue = `${beforeMention}@${user.label}`;
    
    setRow(prev => ({
      ...prev,
      value: newValue,
      anchorEl: null,
      isOpen: false,
    }));
  };

  const handleClosePopper = (rowId: '101' | '102') => {
    const setRow = rowId === '101' ? setRow101 : setRow102;
    setRow(prev => ({ ...prev, anchorEl: null, isOpen: false }));
  };

  useEffect(() => {
    // Success when row102's Popper is open, value is '@', and no mentions
    if (
      row102.isOpen &&
      row102.value === '@' &&
      row102Mentions.length === 0 &&
      row101.value === '' &&
      row101Mentions.length === 0 &&
      !row101.isOpen &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [row101, row102, onSuccess]);

  const renderNoteCell = (rowId: '101' | '102', row: RowState, refEl: React.RefObject<HTMLDivElement | null>) => (
    <>
      <TextField
        ref={refEl as React.RefObject<HTMLDivElement>}
        size="small"
        placeholder="Type @..."
        value={row.value}
        onChange={handleChange(rowId)}
        data-testid={`ticket-${rowId}-note`}
        data-owner={`ticket-${rowId}-note`}
        sx={{ width: 180 }}
      />
      <Popper open={row.isOpen} anchorEl={row.anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
        <ClickAwayListener onClickAway={() => handleClosePopper(rowId)}>
          <Paper elevation={3}>
            <MenuList>
              {USERS.map(user => (
                <MenuItem 
                  key={user.id} 
                  onClick={() => handleSelectMention(rowId, user)}
                  data-testid={`option-${rowId}-${user.id}`}
                >
                  {user.label}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );

  return (
    <Card sx={{ width: 600 }}>
      <CardHeader title="Tickets" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tickets table: open @ suggestions in Ticket #102 Note.
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Ticket #101</TableCell>
              <TableCell><Chip label="Open" size="small" color="warning" /></TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>{renderNoteCell('101', row101, ref101)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ticket #102</TableCell>
              <TableCell><Chip label="In Progress" size="small" color="primary" /></TableCell>
              <TableCell>Jane Smith</TableCell>
              <TableCell>{renderNoteCell('102', row102, ref102)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
