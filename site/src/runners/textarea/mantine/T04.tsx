'use client';

/**
 * textarea-mantine-T04: Edit product description in a modal
 *
 * A centered "Product" card shows a short summary and a button "Edit description".
 * - Light theme, comfortable spacing, default scale.
 * - Clicking the button opens a Mantine Modal (modal_flow).
 * - Inside the modal is one Mantine Textarea labeled "Description", initially containing "(blank)".
 * - The textarea is autosize with minRows=3.
 * - Modal footer has two buttons: "Cancel" and primary "Save".
 * - After saving, the modal closes and the summary text updates.
 *
 * Success: Committed value equals "Compact charger with USB-C cable included." (require_confirm=true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Textarea, Text, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = 'Compact charger with USB-C cable included.';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftValue, setDraftValue] = useState('(blank)');
  const [committedValue, setCommittedValue] = useState('(blank)');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (committedValue.trim() === TARGET_VALUE && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpen = () => {
    setDraftValue(committedValue);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setCommittedValue(draftValue);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">
          Product
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Description: {committedValue}
        </Text>
        <Button onClick={handleOpen} data-testid="btn-edit-description">
          Edit description
        </Button>
      </Card>

      <Modal opened={isModalOpen} onClose={handleCancel} title="Edit Description">
        <Textarea
          label="Description"
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          autosize
          minRows={3}
          data-testid="textarea-description"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="btn-save">
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
}
