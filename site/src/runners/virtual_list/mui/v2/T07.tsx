'use client';

/**
 * virtual_list-mui-v2-T07
 * Reference avatar drawer: choose the exact participant and apply
 *
 * Right Drawer with a "Reference participant" card and a virtualized list.
 * Agent must find PPL-311 whose avatar and team chip match the reference,
 * select it, and click "Use participant". High-contrast theme.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Drawer, Box, Chip, Avatar, Stack,
  ListItemButton, ListItemAvatar, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../../types';

const avatarColors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800', '#f44336', '#795548'];
const teamChips = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'];
const names = ['Sam Rivera', 'Alex Chen', 'Jordan Kim', 'Taylor Park', 'Morgan Lee',
  'Casey Patel', 'Riley Singh', 'Quinn Brown', 'Avery Nguyen', 'Parker Santos'];

interface Participant {
  key: string; code: string; name: string; initials: string;
  avatarColor: string; team: string;
}

const REF_AVATAR_COLOR = '#009688';
const REF_TEAM = 'Echo';
const REF_INITIALS = 'ML';

function buildParticipants(): Participant[] {
  return Array.from({ length: 500 }, (_, i) => {
    const isTarget = i + 180 === 311;
    const nm = isTarget ? 'Morgan Lee' : names[i % names.length];
    return {
      key: `ppl-${i + 180}`,
      code: `PPL-${i + 180}`,
      name: nm,
      initials: nm.split(' ').map(w => w[0]).join(''),
      avatarColor: isTarget ? REF_AVATAR_COLOR : avatarColors[i % avatarColors.length],
      team: isTarget ? REF_TEAM : teamChips[i % teamChips.length],
    };
  });
}

const participants = buildParticipants();

export default function T07({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (savedKey === 'ppl-311' && !open) { successRef.current = true; onSuccess(); }
  }, [savedKey, open, onSuccess]);

  const handleUse = () => {
    if (pendingKey) { setSavedKey(pendingKey); setOpen(false); }
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = participants[index];
    return (
      <ListItemButton style={style} selected={pendingKey === item.key}
        onClick={() => setPendingKey(item.key)} data-item-key={item.key}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: item.avatarColor, width: 32, height: 32, fontSize: 13 }}>
            {item.initials}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={`${item.code} — ${item.name}`}
          primaryTypographyProps={{ fontSize: 13 }} />
        <Chip label={item.team} size="small" sx={{ ml: 1 }} />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500, bgcolor: '#111', borderRadius: 2, color: '#fff' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#1a1a1a' }}>
        <Typography variant="subtitle2" sx={{ color: '#fff' }}>Participant assignment</Typography>
        <Typography variant="body2" sx={{ color: '#aaa' }}>Select a participant for this session.</Typography>
      </Paper>

      <Button variant="contained" onClick={() => { setOpen(true); setPendingKey(null); }}>
        Participants
      </Button>
      {savedKey && (
        <Typography variant="body2" sx={{ ml: 2, display: 'inline', color: '#ccc' }}>
          Used: {participants.find(p => p.key === savedKey)?.code}
        </Typography>
      )}

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 420, p: 2 } }}>
        <Typography variant="subtitle1" gutterBottom>Participants</Typography>

        <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }} data-testid="ref-participant-ppl311">
          <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
            Reference participant
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: REF_AVATAR_COLOR, width: 28, height: 28, fontSize: 12 }}>
              {REF_INITIALS}
            </Avatar>
            <Chip label={REF_TEAM} size="small" />
          </Stack>
        </Paper>

        <Paper variant="outlined">
          <FixedSizeList height={340} width="100%" itemSize={52} itemCount={participants.length} overscanCount={5}>
            {Row}
          </FixedSizeList>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Pending: {pendingKey ?? 'none'}
        </Typography>
        <Button variant="contained" fullWidth sx={{ mt: 1 }} disabled={!pendingKey} onClick={handleUse}>
          Use participant
        </Button>
      </Drawer>
    </Box>
  );
}
