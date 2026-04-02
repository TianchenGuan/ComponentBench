'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Autocomplete, TextField, Chip, Typography, Box, Button, Card, CardContent,
  Drawer, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

function setsEqualCaseSensitive(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.trim()));
  const sb = new Set(b.map(s => s.trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [auditCodes] = useState<string[]>(['AUD-001', 'DO-NOT-EDIT']);
  const [savedTicket, setSavedTicket] = useState<string[]>([]);
  const [savedAudit] = useState<string[]>(['AUD-001', 'DO-NOT-EDIT']);

  const handleSave = () => {
    setSavedTicket([...ticketCodes]);
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    setTicketCodes([...savedTicket]);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqualCaseSensitive(savedTicket, ['ENG-101', 'ENG-204', 'OPS-009']) &&
      setsEqualCaseSensitive(savedAudit, ['AUD-001', 'DO-NOT-EDIT'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedTicket, savedAudit, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Code Management</Typography>
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Edit codes
          </Button>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={handleCancel}>
        <Box sx={{ width: 380, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit codes</Typography>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>Ticket codes</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Codes are case-sensitive and follow AAA-### pattern.
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={[]}
              value={ticketCodes}
              onChange={(_, val) => setTicketCodes(val)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Type code and press Enter" />
              )}
              sx={{ mb: 3 }}
            />

            <Typography variant="body2" sx={{ mb: 0.5 }}>Audit codes</Typography>
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={[]}
              value={auditCodes}
              readOnly
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Audit codes" />
              )}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save codes</Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
