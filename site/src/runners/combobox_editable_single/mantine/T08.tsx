'use client';

/**
 * combobox_editable_single-mantine-T08: Select Chocolate (not chips) inside a modal combobox
 *
 * The page has a button labeled "Add ingredient" that opens a modal dialog.
 * Inside the modal is a custom editable combobox built with Mantine Combobox primitives.
 * - Scene: modal_flow layout, center placement, light theme, comfortable spacing, default scale.
 * - Target component: "Ingredient" combobox (editable input with dropdown suggestions).
 * - Options (~25), with confusable chocolate-related entries: Chocolate, Chocolate (dark), Chocolate chips, etc.
 * - Initial state: empty.
 * - Distractors: Quantity numeric input, Cancel button.
 *
 * Success: The "Ingredient" combobox value equals "Chocolate".
 */

import React, { useState } from 'react';
import { Card, Text, Button, Modal, NumberInput, Stack, Combobox, TextInput, useCombobox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const ingredients = [
  'Chocolate',
  'Chocolate (dark)',
  'Chocolate chips',
  'Cocoa powder',
  'Carob',
  'Butter',
  'Flour',
  'Sugar',
  'Salt',
  'Vanilla',
  'Eggs',
  'Milk',
  'Cream',
  'Baking powder',
  'Baking soda',
  'Cinnamon',
  'Nutmeg',
  'Honey',
  'Maple syrup',
  'Olive oil',
  'Almonds',
  'Walnuts',
  'Pecans',
  'Coconut',
  'Oats',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const filteredIngredients = ingredients.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const options = filteredIngredients.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (val: string) => {
    setValue(val);
    setSearch(val);
    combobox.closeDropdown();
    if (val === 'Chocolate') {
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Recipe Builder</Text>
        <Text size="sm" c="dimmed" mb="md">
          Add ingredients to your recipe
        </Text>
        <Button onClick={() => setModalOpen(true)}>Add ingredient</Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add ingredient"
      >
        <Stack gap="md">
          <div>
            <Text fw={500} size="sm" mb={8}>Ingredient</Text>
            <Combobox
              store={combobox}
              onOptionSubmit={handleOptionSubmit}
            >
              <Combobox.Target>
                <TextInput
                  data-testid="ingredient-combobox"
                  placeholder="Select ingredient"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.currentTarget.value);
                    combobox.openDropdown();
                  }}
                  onClick={() => combobox.openDropdown()}
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  rightSection={<Combobox.Chevron />}
                />
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                  {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </div>

          <div>
            <Text fw={500} size="sm" mb={8}>Quantity</Text>
            <NumberInput placeholder="Amount" min={1} />
          </div>

          <Button variant="subtle" color="gray" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
