'use client';

/**
 * select_custom_multi-mantine-T02: Creatable: add Pineapple
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Fruit bowl".
 * Component: Mantine MultiSelect configured as a creatable multiselect (a "Create ..." option appears when the typed value is not in the list).
 * Label: "Fruits".
 * Options (5): Apples, Bananas, Broccoli, Carrots, Chocolate.
 * Initial state: empty.
 * Behavior: typing filters the dropdown; when the text does not match an existing option, a dropdown item like 'Create "..."' appears and can be clicked (or Enter can create it).
 * No other controls are present.
 *
 * Success: The selected values are exactly: Bananas, Pineapple (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const defaultSuggestions = ['Apples', 'Bananas', 'Broccoli', 'Carrots', 'Chocolate'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Bananas', 'Pineapple']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Fruit bowl</Text>
      <TagsInput
        data-testid="fruits-select"
        label="Fruits"
        placeholder="Select fruits"
        data={defaultSuggestions}
        value={selected}
        onChange={setSelected}
      />
    </Card>
  );
}
