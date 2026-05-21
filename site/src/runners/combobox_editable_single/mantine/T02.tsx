'use client';

/**
 * combobox_editable_single-mantine-T02: Choose Bananas in a Mantine Combobox picker
 *
 * A centered isolated card titled "Grocery picker" contains one editable combobox
 * built with Mantine Combobox primitives (InputBase as the target).
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: Clicking the input opens a dropdown. Selecting an item sets the input value.
 * - Options: Apples, Bananas, Broccoli, Carrots, Chocolate.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Grocery item" combobox value equals "Bananas".
 */

import React, { useState } from 'react';
import { Card, Text, Combobox, InputBase, useCombobox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const groceries = ['Apples', 'Bananas', 'Broccoli', 'Carrots', 'Chocolate'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (val: string) => {
    setValue(val);
    combobox.closeDropdown();
    if (val === 'Bananas') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Grocery picker</Text>
      <Text fw={500} size="sm" mb={8}>Grocery item</Text>
      <Combobox
        store={combobox}
        onOptionSubmit={handleOptionSubmit}
      >
        <Combobox.Target>
          <InputBase
            data-testid="grocery-item"
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents="none"
            onClick={() => combobox.toggleDropdown()}
          >
            {value || <span style={{ color: '#aaa' }}>Select grocery item</span>}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Card>
  );
}
