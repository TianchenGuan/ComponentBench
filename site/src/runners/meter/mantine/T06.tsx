'use client';

/**
 * meter-mantine-T06: Set Quota Usage meter and Apply in modal (Mantine)
 *
 * Setup Description:
 * A modal_flow scene starts with a single "Edit quota" button in an isolated card.
 * - Layout: modal_flow; meter lives inside a modal dialog.
 * - Placement: center.
 * - Component: modal contains one Mantine Progress meter used as a scalar meter.
 * - Spacing/scale: comfortable; default.
 * - Instances: 1 labeled "Quota Usage".
 * - Interaction: open modal → click meter bar to set a pending value → click "Apply" to commit.
 * - Initial state: pending=50%, committed=50% (committed shown in small gray text below).
 * - Feedback: Apply closes modal and shows a toast "Quota updated"; committed value becomes the chosen value.
 *
 * Success: Quota Usage committed value is 85% (±2 percentage points). Apply has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack, Button, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(50);
  const [committedValue, setCommittedValue] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(committedValue - 85) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpenModal = () => {
    setPendingValue(committedValue);
    setIsModalOpen(true);
  };

  const handleApply = () => {
    setCommittedValue(pendingValue);
    setIsModalOpen(false);
    notifications.show({
      title: 'Success',
      message: 'Quota updated',
      color: 'green',
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setPendingValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350, textAlign: 'center' }}>
        <Button onClick={handleOpenModal}>
          Edit quota
        </Button>
      </Card>

      <Modal 
        opened={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit Quota"
      >
        <Stack gap="md">
          <div>
            <Text fw={500} size="sm" mb={8}>Quota Usage</Text>
            <Group gap="sm" align="center">
              <div
                onClick={handleClick}
                style={{ flex: 1, cursor: 'pointer' }}
                data-testid="mantine-meter-quota"
                data-meter-value={pendingValue}
                role="meter"
                aria-valuenow={pendingValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Quota Usage"
              >
                <Progress value={pendingValue} />
              </div>
              <Text size="sm" c="dimmed" style={{ minWidth: 40 }}>{pendingValue}%</Text>
            </Group>
            <Text size="xs" c="dimmed" mt={8}>
              Committed: {committedValue}%
            </Text>
          </div>

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} data-testid="quota-apply">
              Apply
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
