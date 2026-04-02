'use client';

/**
 * autocomplete_freeform-mui-T10: Edit Owner in a dense ticket table
 *
 * setup_description:
 * A tickets table is centered on the page with a header "Tickets" and a light toolbar (refresh icon and column menu) that is not required.
 *
 * The table shows three rows with IDs "#1041", "#1042", and "#1043". One column is labeled "Owner".
 *
 * Only the Owner cell for row "#1042" is editable and contains a MUI Autocomplete (freeSolo) input (single instance of the canonical component on the page). The other rows show plain text owner names.
 *
 * Owner suggestions include similar names ("Daisy Ray", "Daisy Rae", "Dana Ray", "Daryl Ray"). The cell is moderately narrow, so the input is smaller than a full-width form field.
 *
 * Initial state: #1042 Owner is empty. Distractors: other columns (Priority, Status) are read-only text. Feedback: when the Owner value changes, the cell displays the entered/selected name.
 *
 * Success: The #1042 Owner cell's Autocomplete displayed value equals "Daisy Ray" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  TextField,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const ownerSuggestions = ['Daisy Ray', 'Daisy Rae', 'Dana Ray', 'Daryl Ray'];

interface TicketRow {
  id: string;
  owner: string;
  priority: string;
  status: string;
  editable: boolean;
}

const tickets: TicketRow[] = [
  { id: '#1041', owner: 'Dana Ray', priority: 'High', status: 'Open', editable: false },
  { id: '#1042', owner: '', priority: 'Medium', status: 'Pending', editable: true },
  { id: '#1043', owner: 'Daryl Ray', priority: 'Low', status: 'Closed', editable: false },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [ownerValue, setOwnerValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = ownerValue.trim();
  const targetValue = 'Daisy Ray';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card sx={{ width: 550 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Tickets</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    {ticket.editable ? (
                      <Autocomplete
                        data-testid="owner-1042"
                        freeSolo
                        options={ownerSuggestions}
                        inputValue={ownerValue}
                        onInputChange={(_event, newValue) => setOwnerValue(newValue)}
                        size="small"
                        sx={{ width: 140 }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Select" size="small" />
                        )}
                      />
                    ) : (
                      ticket.owner
                    )}
                  </TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
