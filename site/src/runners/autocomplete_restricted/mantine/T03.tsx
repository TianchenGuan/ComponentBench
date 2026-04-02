'use client';

/**
 * autocomplete_restricted-mantine-T03: Open category dropdown
 *
 * setup_description:
 * The page contains one isolated card titled "New expense".
 *
 * It has a Mantine Select labeled **Category** with placeholder "Choose category".
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: empty.
 * - Options: Travel, Meals, Office supplies, Software, Other.
 * - Restricted selection (options only).
 *
 * This task only requires opening the dropdown list and leaving it open; do not choose an item.
 *
 * Success: The Category Select's options popup/listbox is open and visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const categories = [
  { label: 'Travel', value: 'Travel' },
  { label: 'Meals', value: 'Meals' },
  { label: 'Office supplies', value: 'Office supplies' },
  { label: 'Software', value: 'Software' },
  { label: 'Other', value: 'Other' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && isOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">New expense</Text>
      <Text fw={500} size="sm" mb={4}>Category</Text>
      <Select
        data-testid="category-select"
        placeholder="Choose category"
        data={categories}
        value={value}
        onChange={setValue}
        onDropdownOpen={() => setIsOpen(true)}
        onDropdownClose={() => setIsOpen(false)}
      />
    </Card>
  );
}
