'use client';

/**
 * number_input_spinbutton-mantine-T08: Modal: set rate limit and save
 * 
 * The page shows a centered card with a button labeled "Advanced limits".
 * Clicking it opens a modal dialog titled "Advanced limits" (modal_flow).
 * Inside the modal there is one Mantine NumberInput labeled "Rate limit (req/min)".
 * - Constraints: min=0, max=600, step=10.
 * - Initial state: value is 60.
 * The footer has "Cancel" and "Save" buttons. Changes are committed only when "Save" is clicked; Cancel closes the modal and discards edits.
 * 
 * Success: The numeric value of the target number input is 120, and the Save button has been clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text, Button, Modal, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [savedValue, setSavedValue] = useState<number>(60);
  const [tempValue, setTempValue] = useState<string | number>(60);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (savedValue === 120 && hasSaved) {
      onSuccess();
    }
  }, [savedValue, hasSaved, onSuccess]);

  const handleOpen = () => {
    setTempValue(savedValue);
    setOpened(true);
  };

  const handleCancel = () => {
    setOpened(false);
  };

  const handleSave = () => {
    const numVal = typeof tempValue === 'number' ? tempValue : parseInt(tempValue, 10);
    if (!isNaN(numVal)) {
      setSavedValue(numVal);
      setHasSaved(true);
    }
    setOpened(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Rate Limits</Text>
        <Text size="sm" c="dimmed" mb="md">
          Current rate limit: <strong>{savedValue} req/min</strong>
        </Text>
        <Button onClick={handleOpen} data-testid="advanced-limits-btn">
          Advanced limits
        </Button>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Advanced limits"
        centered
      >
        <NumberInput
          label="Rate limit (req/min)"
          min={0}
          max={600}
          step={10}
          value={tempValue}
          onChange={(val) => setTempValue(val)}
          data-testid="rate-limit-input"
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="save-btn">
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
}
