'use client';

/**
 * listbox_single-mui-v2-T40: Modal animal list: scroll to Zebra and apply
 *
 * A preferences card has a "Favorite animal" button. Modal opens with a fixed-height MUI List
 * acting as a listbox. Alphabetized from Aardvark to Zebra; must scroll to reach target.
 * Initial: Cat. Footer: "Cancel" and "Apply choice". Committed only on Apply.
 *
 * Success: Favorite animal = "zebra", "Apply choice" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItemButton, ListItemText,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const animals = [
  'Aardvark', 'Albatross', 'Antelope', 'Bear', 'Bison', 'Buffalo',
  'Cat', 'Cheetah', 'Chinchilla', 'Deer', 'Dolphin', 'Eagle',
  'Elephant', 'Falcon', 'Fox', 'Giraffe', 'Gorilla', 'Hawk',
  'Hedgehog', 'Iguana', 'Jaguar', 'Kangaroo', 'Koala', 'Lemur',
  'Leopard', 'Lion', 'Meerkat', 'Narwhal', 'Ocelot', 'Owl',
  'Panda', 'Penguin', 'Quail', 'Rabbit', 'Raccoon', 'Salmon',
  'Tiger', 'Turtle', 'Urial', 'Vulture', 'Walrus', 'Wolf',
  'Xerus', 'Yak', 'Zebra',
];

const animalOptions = animals.map(a => ({
  value: a.toLowerCase().replace(/\s+/g, '_'),
  label: a,
}));

export default function T40({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string>('cat');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && selected === 'zebra') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, selected, onSuccess]);

  const handleSelect = (value: string) => {
    setSelected(value);
    setApplied(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Preferences</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current favorite: {animalOptions.find(a => a.value === selected)?.label ?? selected}
          </Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>Favorite animal</Button>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Favorite animal</DialogTitle>
        <DialogContent dividers>
          <List
            data-cb-listbox-root
            data-cb-selected-value={selected}
            sx={{ maxHeight: 240, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}
          >
            {animalOptions.map(opt => (
              <ListItemButton
                key={opt.value}
                selected={selected === opt.value}
                onClick={() => handleSelect(opt.value)}
                data-cb-option-value={opt.value}
              >
                <ListItemText primary={opt.label} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setApplied(true); setModalOpen(false); }}>
            Apply choice
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
