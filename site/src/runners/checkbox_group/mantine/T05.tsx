'use client';

/**
 * checkbox_group-mantine-T05: Edit interests in a modal and save
 *
 * Scene: light theme; comfortable spacing; a modal dialog flow centered in the viewport.
 * Mantine page in light theme with a centered profile card. The card has a button "Edit interests".
 * Clicking "Edit interests" opens a Mantine Modal titled "Edit interests".
 * Inside the modal:
 * - One Checkbox.Group labeled "Interests" with six options:
 *   Hiking, Cooking, Photography, Gaming, Gardening, Reading.
 * - Footer buttons: "Save changes" (primary) and "Cancel" (secondary).
 * Initial modal state: Cooking and Reading are checked by default; the others are unchecked.
 * Success: After clicking Save changes, the saved selection equals: Hiking, Photography, and Gaming (only).
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Button, Modal, Checkbox, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const interestOptions = ['Hiking', 'Cooking', 'Photography', 'Gaming', 'Gardening', 'Reading'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Cooking', 'Reading']);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    const targetSet = new Set(['Hiking', 'Photography', 'Gaming']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
    setOpened(false);
  };

  const handleCancel = () => {
    setSelected(['Cooking', 'Reading']); // Reset
    setOpened(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Profile</Text>
        <Text size="sm" c="dimmed" mb="md">
          Customize your interests to get personalized recommendations.
        </Text>
        <Button onClick={() => setOpened(true)}>Edit interests</Button>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Edit interests"
        centered
      >
        <Text fw={500} size="sm" mb="xs">Interests</Text>
        <Checkbox.Group
          data-testid="cg-interests"
          value={selected}
          onChange={setSelected}
        >
          <Stack gap="xs">
            {interestOptions.map(interest => (
              <Checkbox key={interest} value={interest} label={interest} />
            ))}
          </Stack>
        </Checkbox.Group>

        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} data-testid="btn-save-changes">Save changes</Button>
        </Group>
      </Modal>
    </>
  );
}
