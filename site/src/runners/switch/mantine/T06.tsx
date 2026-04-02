'use client';

/**
 * switch-mantine-T06: Open modal and enable Offline mode
 *
 * Layout: modal_flow with the trigger button placed near the bottom-right of the viewport.
 * The main page shows a small card titled "Network" and a button labeled "Connectivity".
 * The target switch is not visible until the button is clicked. Clicking "Connectivity" opens a centered Mantine Modal titled "Connectivity".
 * Inside the modal, there is one Mantine Switch labeled "Offline mode" (target) and one paragraph of explanatory text.
 * Initial state: "Offline mode" is OFF.
 * Feedback: toggling the switch updates immediately; closing the modal is not required for success.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
        <Text fw={500} size="lg" mb="md">Network</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage your network and connectivity settings.
        </Text>
        <Button onClick={open}>Connectivity</Button>
      </Card>
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Connectivity"
        data-testid="connectivity-modal"
      >
        <Switch
          checked={checked}
          onChange={handleChange}
          label="Offline mode"
          data-testid="offline-mode-switch"
          aria-checked={checked}
        />
        <Text size="sm" c="dimmed" mt="md">
          When enabled, the app will work without an internet connection using cached data.
        </Text>
      </Modal>
    </>
  );
}
