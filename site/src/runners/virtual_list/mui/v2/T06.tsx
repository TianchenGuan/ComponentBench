'use client';

/**
 * virtual_list-mui-v2-T06
 * Incidents table: row-scoped lead picker with duplicate names
 *
 * Dark-theme table with row Poppers. Agent must open Incident 21's picker,
 * select MEM-0204 (Morgan Chen), and click "Save row".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Box, Chip, Table, TableHead, TableBody, TableRow, TableCell,
  Popper, ClickAwayListener, ListItemButton, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Member { key: string; code: string; name: string; }

const firstNames = ['Aisha', 'Ben', 'Carlos', 'Diana', 'Eli', 'Fiona', 'Gael', 'Hana', 'Ivan', 'Julia',
  'Kai', 'Lena', 'Mason', 'Nora', 'Oscar', 'Priya', 'Quinn', 'Riley', 'Sam', 'Morgan'];
const lastNames = ['Patel', 'Nguyen', 'Park', 'Chen', 'Santos', 'Kim', 'Lee', 'Alvarez', 'Singh', 'Rivera'];

function buildMembers(): Member[] {
  const list: Member[] = [];
  for (let i = 0; i < 400; i++) {
    list.push({
      key: `mem-${String(i).padStart(4, '0')}`,
      code: `MEM-${String(i).padStart(4, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
    });
  }
  list[41] = { key: 'mem-0041', code: 'MEM-0041', name: 'Morgan Chen' };
  list[204] = { key: 'mem-0204', code: 'MEM-0204', name: 'Morgan Chen' };
  return list;
}

const members = buildMembers();

interface IncidentRow { id: number; name: string; severity: string; }
const incidents: IncidentRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1, name: `Incident ${i + 1}`,
  severity: ['Critical', 'High', 'Medium', 'Low'][i % 4],
}));

function RowPicker({ anchorEl, open, onClose, onSave }: {
  anchorEl: HTMLElement | null; open: boolean; onClose: () => void;
  onSave: (key: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = members[index];
    return (
      <ListItemButton style={style} selected={selected === item.key}
        onClick={() => setSelected(item.key)} data-item-key={item.key}>
        <ListItemText primary={`${item.code} — ${item.name}`} primaryTypographyProps={{ fontSize: 12 }} />
      </ListItemButton>
    );
  };

  return (
    <Popper open={open} anchorEl={anchorEl} placement="left-start" sx={{ zIndex: 1300 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper elevation={4} sx={{ width: 300, p: 1 }}>
          <FixedSizeList height={250} width="100%" itemSize={40} itemCount={members.length} overscanCount={5}>
            {Row}
          </FixedSizeList>
          <Button size="small" variant="contained" fullWidth sx={{ mt: 1 }} disabled={!selected}
            onClick={() => { if (selected) { onSave(selected); onClose(); } }}>
            Save row
          </Button>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [savedRows, setSavedRows] = useState<Record<number, string>>({});
  const [pickerRow, setPickerRow] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (savedRows[21] === 'mem-0204') { successRef.current = true; onSuccess(); }
  }, [savedRows, onSuccess]);

  const handleOpen = (rowId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    setPickerRow(rowId);
    setAnchorEl(event.currentTarget);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, minWidth: 640 }}>
        <Paper sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Incident</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Lead</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Chip label={row.severity} size="small"
                      color={row.severity === 'Critical' ? 'error' : row.severity === 'High' ? 'warning' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{savedRows[row.id] ?? '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={(e) => handleOpen(row.id, e)}>Assign lead</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {pickerRow !== null && (
          <RowPicker
            anchorEl={anchorEl}
            open={pickerRow !== null}
            onClose={() => { setPickerRow(null); setAnchorEl(null); }}
            onSave={(key) => setSavedRows(prev => ({ ...prev, [pickerRow]: key }))}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
