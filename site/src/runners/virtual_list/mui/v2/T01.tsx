'use client';

/**
 * virtual_list-mui-v2-T01
 * Bottom drawer people picker: exact duplicate member and confirm
 *
 * Drawer anchored to bottom with a virtualized people list. Two Diego Alvarez
 * rows with different IDs/teams. Agent must select USR-0204 (Ops) and click
 * "Use member".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Drawer, ListItemButton, ListItemText, Box, Chip, Stack } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../../types';

interface PersonItem { key: string; code: string; name: string; team: string; }

const teams = ['Ops', 'Infra', 'Platform', 'Security', 'ML', 'DevOps', 'Analytics', 'Backend', 'Frontend', 'QA'];
const firstNames = ['Aisha', 'Ben', 'Carlos', 'Diana', 'Eli', 'Fiona', 'Gael', 'Hana', 'Ivan', 'Julia'];
const lastNames = ['Patel', 'Nguyen', 'Park', 'Müller', 'Santos', 'Chen', 'Kim', 'Alvarez', 'Singh', 'Lee'];

function buildPeople(): PersonItem[] {
  const list: PersonItem[] = [];
  for (let i = 0; i < 800; i++) {
    list.push({
      key: `usr-${String(i).padStart(4, '0')}`,
      code: `USR-${String(i).padStart(4, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
      team: teams[i % teams.length],
    });
  }
  list[41] = { key: 'usr-0041', code: 'USR-0041', name: 'Diego Alvarez', team: 'Infra' };
  list[204] = { key: 'usr-0204', code: 'USR-0204', name: 'Diego Alvarez', team: 'Ops' };
  return list;
}

const people = buildPeople();

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (savedKey === 'usr-0204' && !open) {
      successRef.current = true;
      onSuccess();
    }
  }, [savedKey, open, onSuccess]);

  const handleUse = () => {
    if (pendingKey) { setSavedKey(pendingKey); setOpen(false); }
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = people[index];
    return (
      <ListItemButton
        style={style}
        selected={pendingKey === item.key}
        onClick={() => setPendingKey(item.key)}
        data-item-key={item.key}
        aria-selected={pendingKey === item.key}
      >
        <ListItemText
          primary={`${item.code} — ${item.name} (${item.team})`}
          primaryTypographyProps={{ fontSize: 13 }}
        />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Handoff form</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Status: Active" size="small" color="success" />
          <Chip label="Region: US-West" size="small" />
        </Stack>
      </Paper>

      <Button variant="contained" onClick={() => { setOpen(true); setPendingKey(null); }}>
        Choose member
      </Button>
      {savedKey && (
        <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
          Assigned: {people.find(p => p.key === savedKey)?.code}
        </Typography>
      )}

      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}
        PaperProps={{ sx: { maxHeight: '60vh', p: 2 } }}
      >
        <Typography variant="subtitle1" gutterBottom>People list</Typography>
        <Paper variant="outlined">
          <FixedSizeList height={360} width="100%" itemSize={48} itemCount={people.length} overscanCount={5}>
            {Row}
          </FixedSizeList>
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Pending: {pendingKey ?? 'none'}
        </Typography>
        <Button variant="contained" fullWidth sx={{ mt: 1 }} disabled={!pendingKey} onClick={handleUse}>
          Use member
        </Button>
      </Drawer>
    </Box>
  );
}
