'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon,
  ListItemText, Checkbox, Button, Paper, Grid, Typography, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const contacts = [
  'Priya Shah', 'Mateo Rossi', 'Olivia Chen', 'Daniel Reed',
  'Ava Patel', 'Eva Müller', 'Lucas Brown', 'Sofia Garcia',
  'Noah Kim', 'Mia Johnson', 'Ethan Wright', 'Emma Davis',
];

const SMS_TARGET = ['Priya Shah', 'Mateo Rossi', 'Olivia Chen', 'Daniel Reed'];
const EMAIL_MUST_REMAIN = ['Eva Müller'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T07({ onSuccess }: TaskComponentProps) {
  const [smsChecked, setSmsChecked] = useState<string[]>([]);
  const [smsLeft, setSmsLeft] = useState(not(contacts, ['Mateo Rossi', 'Ava Patel']));
  const [smsRight, setSmsRight] = useState(['Mateo Rossi', 'Ava Patel']);
  const [emailChecked, setEmailChecked] = useState<string[]>([]);
  const [emailLeft, setEmailLeft] = useState(not(contacts, ['Eva Müller']));
  const [emailRight, setEmailRight] = useState(['Eva Müller']);
  const [committed, setCommitted] = useState<{ sms: string[]; email: string[] } | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (
      !successFired.current && committed &&
      setsEqual(committed.sms, SMS_TARGET) &&
      setsEqual(committed.email, EMAIL_MUST_REMAIN)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleSave = () => {
    setCommitted({ sms: [...smsRight], email: [...emailRight] });
  };

  const makeToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (v: string) => () => setter(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const makeMove = (
    checked: string[], pane: string[],
    setTo: React.Dispatch<React.SetStateAction<string[]>>,
    setFrom: React.Dispatch<React.SetStateAction<string[]>>,
    setChecked: React.Dispatch<React.SetStateAction<string[]>>,
  ) => () => {
    const sel = checked.filter(v => pane.includes(v));
    setTo(prev => [...prev, ...sel]);
    setFrom(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const renderList = (title: string, items: string[], checked: string[], toggle: (v: string) => () => void) => (
    <Paper sx={{ width: 180, height: 240, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500, fontSize: '0.85rem' }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={toggle(v)} sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Checkbox size="small" checked={checked.includes(v)} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={v} primaryTypographyProps={{ fontSize: '0.8rem' }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  const renderTransfer = (
    label: string,
    left: string[], right: string[], checked: string[],
    toggle: (v: string) => () => void,
    moveRight: () => void, moveLeft: () => void,
  ) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item>{renderList('Available', left, checked, toggle)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button size="small" variant="outlined" onClick={moveRight}
              disabled={!checked.some(v => left.includes(v))} sx={{ my: 0.5, minWidth: 32 }}>{'>'}</Button>
            <Button size="small" variant="outlined" onClick={moveLeft}
              disabled={!checked.some(v => right.includes(v))} sx={{ my: 0.5, minWidth: 32 }}>{'<'}</Button>
          </Grid>
        </Grid>
        <Grid item>{renderList('Selected', right, checked, toggle)}</Grid>
      </Grid>
    </Box>
  );

  const toggleSms = makeToggle(setSmsChecked);
  const toggleEmail = makeToggle(setEmailChecked);

  return (
    <Box sx={{ p: 2, maxWidth: 560, ml: 'auto', mr: 3, mt: 2 }}>
      <Card variant="outlined">
        <CardHeader title="Recipient settings" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          {renderTransfer('Email recipients', emailLeft, emailRight, emailChecked, toggleEmail,
            makeMove(emailChecked, emailLeft, setEmailRight, setEmailLeft, setEmailChecked),
            makeMove(emailChecked, emailRight, setEmailLeft, setEmailRight, setEmailChecked))}
          <Divider sx={{ my: 2 }} />
          {renderTransfer('SMS recipients', smsLeft, smsRight, smsChecked, toggleSms,
            makeMove(smsChecked, smsLeft, setSmsRight, setSmsLeft, setSmsChecked),
            makeMove(smsChecked, smsRight, setSmsLeft, setSmsRight, setSmsChecked))}
          <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Save recipients</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
