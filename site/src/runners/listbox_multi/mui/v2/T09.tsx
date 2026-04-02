'use client';

/**
 * listbox_multi-mui-v2-T09: Night shift overrides row checklist
 *
 * Table with two expanded rows (Day, Night), each containing "Actions" checklist + row-local Save row.
 * Night (TARGET) initial: Pager, Retry later. Day initial: Email (must remain unchanged).
 * Target Night: Pager, Escalate to manager, Create ticket. Confirm via "Save row" for Night.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Collapse, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Chip, Box,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const actionOptions = ['Pager', 'Email', 'Escalate to manager', 'Create ticket', 'Retry later', 'Ignore'];
const targetSet = ['Pager', 'Escalate to manager', 'Create ticket'];
const dayInitial = ['Email'];

interface ShiftRowProps {
  label: string;
  selected: string[];
  onToggle: (v: string) => void;
  onSave: () => void;
  defaultOpen: boolean;
}

function ShiftRow({ label, selected, onToggle, onSave, defaultOpen }: ShiftRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{label}</TableCell>
        <TableCell>
          <Chip label="Active" color="success" size="small" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Actions</Typography>
              <List dense sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {actionOptions.map(opt => (
                  <ListItem key={opt} disablePadding>
                    <ListItemButton dense onClick={() => onToggle(opt)}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          size="small"
                          checked={selected.includes(opt)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={opt} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                data-testid={`save-row-${label.toLowerCase()}`}
                onClick={onSave}
              >
                Save row
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [nightSelected, setNightSelected] = useState<string[]>(['Pager', 'Retry later']);
  const [daySelected, setDaySelected] = useState<string[]>(['Email']);
  const [nightSaved, setNightSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (nightSaved && setsEqual(nightSelected, targetSet) && setsEqual(daySelected, dayInitial)) {
      successFired.current = true;
      onSuccess();
    }
  }, [nightSaved, nightSelected, daySelected, onSuccess]);

  const toggleItem = (list: string[], setList: (v: string[]) => void, value: string, resetSave?: () => void) => {
    const idx = list.indexOf(value);
    const next = [...list];
    if (idx === -1) next.push(value); else next.splice(idx, 1);
    setList(next);
    if (resetSave) resetSave();
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh' }}>
      <Card sx={{ maxWidth: 560 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Shift overrides</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure escalation actions per shift
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Shift</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <ShiftRow
                  label="Day"
                  selected={daySelected}
                  onToggle={(v) => toggleItem(daySelected, setDaySelected, v)}
                  onSave={() => {}}
                  defaultOpen
                />
                <ShiftRow
                  label="Night"
                  selected={nightSelected}
                  onToggle={(v) => toggleItem(nightSelected, setNightSelected, v, () => setNightSaved(false))}
                  onSave={() => setNightSaved(true)}
                  defaultOpen
                />
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
