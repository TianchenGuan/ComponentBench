'use client';

/**
 * listbox_single-mui-T08: Animal list: scroll to Zebra
 *
 * Scene: light theme, compact spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is small. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card titled "Favorite animal" contains a scrollable MUI List constrained to ~200px height,
 * rendered in compact spacing and small scale. It includes ~26–35 alphabetically sorted animals
 * (Aardvark, Bear, Cat, …, Yak, Zebra). Only one item can be selected. Initial selection is "Cat".
 * The target "Zebra" is near the bottom and requires scrolling inside the list container.
 * The page itself does not need scrolling.
 *
 * Success: Selected option value equals: zebra
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const animals = [
  'Aardvark', 'Bear', 'Cat', 'Dog', 'Elephant', 'Fox', 'Giraffe', 'Horse',
  'Iguana', 'Jaguar', 'Koala', 'Lion', 'Monkey', 'Newt', 'Owl', 'Penguin',
  'Quail', 'Rabbit', 'Snake', 'Tiger', 'Unicorn', 'Vulture', 'Wolf',
  'Xerus', 'Yak', 'Zebra',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('cat');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'zebra') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 300 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontSize: 14 }}>
          Favorite animal
        </Typography>
        <Box
          sx={{
            height: 200,
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
          }}
        >
          <List
            data-cb-listbox-root
            data-cb-selected-value={selected}
            dense
          >
            {animals.map(animal => {
              const value = animal.toLowerCase();
              return (
                <ListItemButton
                  key={value}
                  selected={selected === value}
                  onClick={() => handleSelect(value)}
                  data-cb-option-value={value}
                  sx={{ py: 0.5 }}
                >
                  <ListItemText 
                    primary={animal} 
                    primaryTypographyProps={{ fontSize: 12 }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}
