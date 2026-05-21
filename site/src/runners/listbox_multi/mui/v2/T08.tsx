'use client';

/**
 * listbox_multi-mui-v2-T08: Offscreen city list exact subset with apply
 *
 * Single MUI List labeled "Cities" with 70 alphabetized rows, only ~10 visible.
 * Small right-aligned checkboxes. Internal scroll. Initial: Lima checked.
 * Target: Kyoto, Lisbon, Tallinn. Confirm via "Apply cities".
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, List, ListItem,
  ListItemButton, ListItemText, Checkbox, Box,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const cities = [
  'Abu Dhabi', 'Accra', 'Addis Ababa', 'Amsterdam', 'Ankara', 'Athens', 'Auckland',
  'Baghdad', 'Bangkok', 'Barcelona', 'Beijing', 'Beirut', 'Belgrade', 'Berlin', 'Bogotá',
  'Brussels', 'Bucharest', 'Budapest', 'Buenos Aires', 'Cairo', 'Calgary', 'Cape Town',
  'Casablanca', 'Chennai', 'Chicago', 'Copenhagen', 'Dakar', 'Delhi', 'Dhaka', 'Dubai',
  'Dublin', 'Edinburgh', 'Frankfurt', 'Geneva', 'Hanoi', 'Helsinki', 'Ho Chi Minh City',
  'Hong Kong', 'Istanbul', 'Jakarta', 'Johannesburg', 'Karachi', 'Kathmandu', 'Kuala Lumpur',
  'Kyoto', 'Lagos', 'Lima', 'Lisbon', 'London', 'Los Angeles', 'Madrid', 'Manila',
  'Melbourne', 'Mexico City', 'Milan', 'Montreal', 'Moscow', 'Mumbai', 'Nairobi', 'New York',
  'Oslo', 'Ottawa', 'Paris', 'Prague', 'Riyadh', 'Rome', 'Seoul', 'Shanghai',
  'Singapore', 'Stockholm', 'Sydney', 'Tallinn', 'Tehran', 'Tokyo', 'Toronto',
  'Vancouver', 'Vienna', 'Warsaw', 'Zurich',
];

const targetSet = ['Kyoto', 'Lisbon', 'Tallinn'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Lima']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  const handleToggle = (city: string) => {
    const idx = selected.indexOf(city);
    const next = [...selected];
    if (idx === -1) next.push(city); else next.splice(idx, 1);
    setSelected(next);
    setSaved(false);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-start' }}>
      <Card sx={{ width: 340 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Cities</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the cities to include in the report.
          </Typography>
          <List
            dense
            sx={{ maxHeight: 280, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}
          >
            {cities.map(city => (
              <ListItem
                key={city}
                disablePadding
                secondaryAction={
                  <Checkbox
                    edge="end"
                    size="small"
                    checked={selected.includes(city)}
                    onChange={() => handleToggle(city)}
                  />
                }
              >
                <ListItemButton dense onClick={() => handleToggle(city)}>
                  <ListItemText primary={city} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Selected: {selected.length}
          </Typography>
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setSaved(true)}>
            Apply cities
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
