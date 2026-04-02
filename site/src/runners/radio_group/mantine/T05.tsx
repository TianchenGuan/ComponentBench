'use client';

/**
 * radio_group-mantine-T05: Privacy modal: set Who can comment to Followers and save
 *
 * The page shows an isolated card titled "Privacy" with a button labeled "Edit privacy".
 * Clicking it opens a Mantine Modal in the center (modal_flow).
 * Inside the modal is one Radio.Group labeled "Who can comment?" with options:
 * - Everyone
 * - Followers
 * - No one
 * Initial state: Everyone.
 * The modal footer has "Cancel" and "Save". The underlying card's summary text only updates after "Save" is clicked (persisted state).
 * The modal body also includes a non-required toggle ("Show activity status") as a distractor, but success depends only on the radio selection + Save.
 *
 * Success: Persisted value for "Who can comment?" equals "followers" (label "Followers").
 *          Clicking "Save" is required.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Radio, Stack, Button, Modal, Group, Switch } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Everyone', value: 'everyone' },
  { label: 'Followers', value: 'followers' },
  { label: 'No one', value: 'no_one' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [persistedValue, setPersistedValue] = useState<string>('everyone');
  const [tempValue, setTempValue] = useState<string>('everyone');
  const hasSucceeded = useRef(false);

  const handleOpenModal = () => {
    setTempValue(persistedValue);
    setModalOpen(true);
  };

  const handleSave = () => {
    setPersistedValue(tempValue);
    setModalOpen(false);
    if (tempValue === 'followers' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempValue(persistedValue);
    setModalOpen(false);
  };

  const persistedLabel = options.find(o => o.value === persistedValue)?.label || '';

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
        <Text fw={600} size="lg" mb="xs">Privacy</Text>
        <Text size="sm" c="dimmed" mb="md">Who can comment: {persistedLabel}</Text>
        <Button onClick={handleOpenModal}>Edit privacy</Button>
      </Card>

      <Modal 
        opened={modalOpen} 
        onClose={handleCancel} 
        title="Privacy settings"
        centered
      >
        <Stack gap="md">
          <Radio.Group
            data-canonical-type="radio_group"
            data-selected-value={tempValue}
            value={tempValue}
            onChange={setTempValue}
            label="Who can comment?"
          >
            <Stack gap="xs" mt="xs">
              {options.map(option => (
                <Radio key={option.value} value={option.value} label={option.label} />
              ))}
            </Stack>
          </Radio.Group>

          {/* Distractor toggle */}
          <Group justify="space-between">
            <Text size="sm">Show activity status</Text>
            <Switch defaultChecked />
          </Group>
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Modal>
    </>
  );
}
