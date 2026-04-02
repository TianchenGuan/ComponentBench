'use client';

/**
 * select_custom_multi-mantine-T06: Scroll to pick supplies
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=top_right, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card anchored near the top-right of the viewport titled "Office supplies".
 * Component: Mantine MultiSelect labeled "Supplies".
 * Options (18) in alphabetical order: Binder, Clips, Envelopes, Eraser, Folders, Glue, Highlighter, Labels, Marker, Notebook, Paper, Pen, Pencil, Ruler, Scissors, Stapler, Tape, Whiteout.
 * The dropdown is scrollable and shows about 7 items at a time, so scrolling is needed to reach items near the bottom.
 * Initial state: empty.
 * No other interactive components are present.
 *
 * Success: The selected values are exactly: Highlighter, Notebook, Scissors, Stapler (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const supplyOptions = [
  'Binder', 'Clips', 'Envelopes', 'Eraser', 'Folders', 'Glue',
  'Highlighter', 'Labels', 'Marker', 'Notebook', 'Paper', 'Pen',
  'Pencil', 'Ruler', 'Scissors', 'Stapler', 'Tape', 'Whiteout'
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Highlighter', 'Notebook', 'Scissors', 'Stapler']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Office supplies</Text>
      <MultiSelect
        data-testid="supplies-select"
        label="Supplies"
        placeholder="Select supplies"
        data={supplyOptions}
        value={selected}
        onChange={setSelected}
        maxDropdownHeight={220}
      />
    </Card>
  );
}
