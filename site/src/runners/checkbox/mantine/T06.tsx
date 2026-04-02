'use client';

/**
 * checkbox-mantine-T06: Enable experimental caching in modal
 *
 * Layout: modal flow.
 * The main page shows an isolated card titled "Performance" with a button labeled "Advanced settings".
 * Clicking it opens a Mantine Modal titled "Advanced settings".
 * Inside the modal there is one Mantine Checkbox labeled "Use experimental caching" (initially unchecked).
 * The modal footer has a primary button labeled "Done" and a secondary "Cancel".
 * The checkbox change is only committed when "Done" is clicked; cancel/close discards changes.
 * Distractors: none besides the Cancel/close controls.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Modal, Checkbox, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempChecked, setTempChecked] = useState(false);
  const [committed, setCommitted] = useState(false);

  const handleOpenModal = () => {
    setTempChecked(false);
    setModalOpen(true);
  };

  const handleDone = () => {
    if (tempChecked && !committed) {
      setCommitted(true);
      setModalOpen(false);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempChecked(false);
    setModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="sm">
          Performance
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Configure performance settings for optimal experience.
        </Text>
        <Button onClick={handleOpenModal} data-testid="btn-advanced-settings">
          Advanced settings
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Advanced settings"
        data-testid="modal-advanced-settings"
      >
        <Checkbox
          checked={tempChecked}
          onChange={(e) => setTempChecked(e.currentTarget.checked)}
          label="Use experimental caching"
          data-testid="cb-experimental-caching"
        />
        <Text size="xs" c="dimmed" mt={4} ml={28}>
          Enable the new caching system for faster load times.
        </Text>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleDone} data-testid="btn-done">
            Done
          </Button>
        </Group>
      </Modal>
    </>
  );
}
