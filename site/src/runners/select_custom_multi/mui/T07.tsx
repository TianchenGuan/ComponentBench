'use client';

/**
 * select_custom_multi-mui-T07: Search and pick three milk options
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=bottom_left, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card anchored near the bottom-left of the viewport titled "Grocery list".
 * Component: MUI Autocomplete (multiple) labeled "Milks".
 * The dropdown suggestion list is long (25 items) and scrollable; the input supports type-to-filter search.
 * Options include: Almond milk, Oat milk, Soy milk, Coconut milk, Rice milk, Cashew milk, Skim milk, Whole milk, 2% milk, Lactose-free milk, Chocolate milk, etc.
 * Initial state: empty.
 * No other interactive elements are present.
 *
 * Success: The selected values are exactly: Almond milk, Oat milk, Soy milk (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const milkOptions = [
  'Almond milk', 'Oat milk', 'Soy milk', 'Coconut milk', 'Rice milk',
  'Cashew milk', 'Skim milk', 'Whole milk', '2% milk', '1% milk',
  'Lactose-free milk', 'Chocolate milk', 'Strawberry milk', 'Vanilla milk',
  'Macadamia milk', 'Hemp milk', 'Flax milk', 'Pea milk', 'Banana milk',
  'Hazelnut milk', 'Pistachio milk', 'Walnut milk', 'Goat milk',
  'A2 milk', 'Raw milk'
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Almond milk', 'Oat milk', 'Soy milk']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Grocery list</Typography>
        <Autocomplete
          multiple
          data-testid="milks-select"
          options={milkOptions}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Milks" placeholder="Search milks" />
          )}
          ListboxProps={{ style: { maxHeight: 200 } }}
        />
      </CardContent>
    </Card>
  );
}
