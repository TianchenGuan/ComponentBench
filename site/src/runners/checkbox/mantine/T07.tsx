'use client';

/**
 * checkbox-mantine-T07: Disable public profile with confirmation
 *
 * Layout: settings panel with several rows.
 * One row is labeled "Public profile" and uses a Mantine Checkbox (initially checked).
 * Interaction behavior: when you attempt to turn it off, a confirmation dialog appears asking to confirm disabling public profile.
 * The dialog provides "Cancel" and "Disable" actions. The checkbox only becomes committed as unchecked after clicking "Disable".
 * Clutter: other rows exist (non-checkbox controls), but they do not affect the target checkbox state.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox, Modal, Button, Group, TextInput, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.checked && checked) {
      // Trying to disable - show confirmation
      setDialogOpen(true);
    } else {
      // Enabling - just do it
      setChecked(true);
    }
  };

  const handleDisable = () => {
    setChecked(false);
    setDialogOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Text fw={600} size="lg" mb="md">
          Profile Settings
        </Text>
        
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Non-checkbox row */}
          <Group justify="space-between">
            <Text c="dimmed">Display name</Text>
            <TextInput value="John Doe" disabled style={{ width: 180 }} />
          </Group>

          {/* Checkbox row */}
          <Group justify="space-between">
            <Text c="dimmed">Public profile</Text>
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              data-testid="cb-public-profile"
            />
          </Group>

          {/* Another non-checkbox row */}
          <Group justify="space-between">
            <Text c="dimmed">Email visibility</Text>
            <TextInput value="Private" disabled style={{ width: 180 }} />
          </Group>
        </Box>
      </Card>

      <Modal
        opened={dialogOpen}
        onClose={handleCancel}
        title="Confirm change"
        centered
      >
        <Text>
          Are you sure you want to disable your public profile? Other users will no longer be able to view your profile page.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDisable}>
            Disable
          </Button>
        </Group>
      </Modal>
    </>
  );
}
