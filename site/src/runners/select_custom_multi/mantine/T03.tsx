'use client';

/**
 * select_custom_multi-mantine-T03: Clear all selected tags
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Tag filters".
 * Component: Mantine MultiSelect labeled "Tags" with clearable enabled (a clear 'x' icon appears on the right).
 * Options (7): Design, Frontend, Backend, Mobile, Data, DevOps, QA.
 * Initial state: three pills are selected: Frontend, Data, QA.
 * No other interactive elements are present.
 *
 * Success: The selected values are exactly: (empty) (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const tagOptions = ['Design', 'Frontend', 'Backend', 'Mobile', 'Data', 'DevOps', 'QA'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Frontend', 'Data', 'QA']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tag filters</Text>
      <MultiSelect
        data-testid="tags-select"
        label="Tags"
        placeholder="Select tags"
        data={tagOptions}
        value={selected}
        onChange={setSelected}
        clearable
      />
    </Card>
  );
}
