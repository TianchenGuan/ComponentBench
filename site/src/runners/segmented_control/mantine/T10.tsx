'use client';

/**
 * segmented_control-mantine-T10: Data retention → 30 days + Confirm
 *
 * Layout: modal confirmation flow on a dark-themed page.
 * A centered card titled "Compliance" contains a Mantine SegmentedControl labeled "Data retention" with options:
 * "7 days", "30 days", "90 days".
 *
 * Initial committed state: "7 days" is selected.
 *
 * Confirmation behavior:
 * - When the selection changes, a confirmation modal dialog appears titled "Apply retention change?".
 * - Dialog buttons: "Cancel" and "Confirm".
 * - The new value is committed only after clicking "Confirm".
 * - Clicking "Cancel" reverts to the previously committed value.
 *
 * Clutter (low): a warning paragraph about compliance requirements is present but not required.
 *
 * Success: The committed value of "Data retention" is 30 days.
 * The confirmation dialog has been accepted via "Confirm".
 */

import React, { useState } from 'react';
import { Card, Text, Modal, Button, Group, Alert, SegmentedControl } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const retentionOptions = ['7 days', '30 days', '90 days'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [committedValue, setCommittedValue] = useState<string>('7 days');
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (value: string) => {
    if (value !== committedValue) {
      setPendingValue(value);
      setDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    if (pendingValue) {
      setCommittedValue(pendingValue);
      if (pendingValue === '30 days') {
        onSuccess();
      }
    }
    setPendingValue(null);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setPendingValue(null);
    setDialogOpen(false);
  };

  const displayValue = pendingValue || committedValue;

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Compliance</Text>

        <Alert icon={<IconAlertTriangle size={16} />} color="yellow" mb="md">
          Data retention policies affect how long user data is stored. Ensure compliance with your organization&apos;s requirements.
        </Alert>

        <Text fw={500} mb="xs">Data retention</Text>
        <SegmentedControl
          data-testid="data-retention"
          data-canonical-type="segmented_control"
          data-selected-value={displayValue}
          data-committed-value={committedValue}
          data={retentionOptions}
          value={displayValue}
          onChange={handleChange}
          fullWidth
        />
      </Card>

      <Modal opened={dialogOpen} onClose={handleCancel} title="Apply retention change?" centered>
        <Text size="sm" mb="lg">
          Changing the data retention period will affect how long user data is stored. This action may have compliance implications.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Group>
      </Modal>
    </>
  );
}
