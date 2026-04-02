'use client';

/**
 * select_native-mantine-T07: Choose Koa from grouped backend options
 *
 * Layout: a centered isolated card titled "Backend setup".
 * The target is a Mantine NativeSelect labeled "Backend framework", populated with grouped options (native <optgroup>).
 *
 * Groups and options (label → value):
 * Node:
 * - Express → express
 * - Koa → koa  ← TARGET
 * Python:
 * - Django → django
 * - Flask → flask
 * Ruby:
 * - Rails → rails
 *
 * Initial state: Express is selected.
 * Clutter: none.
 * Feedback: immediate, no Apply/Save.
 *
 * Success: The target native select has selected option value 'koa' (label 'Koa').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('express');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'koa') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Backend setup</Text>
      
      <NativeSelect
        data-testid="backend-framework-select"
        data-canonical-type="select_native"
        data-selected-value={selected}
        label="Backend framework"
        value={selected}
        onChange={handleChange}
      >
        <optgroup label="Node">
          <option value="express">Express</option>
          <option value="koa">Koa</option>
        </optgroup>
        <optgroup label="Python">
          <option value="django">Django</option>
          <option value="flask">Flask</option>
        </optgroup>
        <optgroup label="Ruby">
          <option value="rails">Rails</option>
        </optgroup>
      </NativeSelect>
    </Card>
  );
}
