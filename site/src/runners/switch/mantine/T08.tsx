'use client';

/**
 * switch-mantine-T08: Confirm to disable Public profile
 *
 * Layout: settings_panel centered in the viewport titled "Profile visibility".
 * The panel contains one Mantine Switch labeled "Public profile" with helper text ("Anyone with the link can view your profile").
 * Initial state: the switch is ON.
 * Interaction behavior: when attempting to turn it OFF, a small confirmation popover appears near the switch.
 * The popover includes explanatory text and two buttons: "Cancel" and "Turn off".
 * Feedback dynamics: clicking "Turn off" applies the change and the switch becomes OFF; clicking "Cancel" leaves it ON.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Popover, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const handleSwitchClick = () => {
    if (checked) {
      // Trying to turn OFF, show confirmation
      setPopoverOpened(true);
    } else {
      // Turning ON, just toggle
      setChecked(true);
    }
  };

  const handleConfirm = () => {
    setChecked(false);
    setPopoverOpened(false);
    onSuccess();
  };

  const handleCancel = () => {
    setPopoverOpened(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Profile visibility</Text>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Text size="sm" id="public-profile-label">Public profile</Text>
          <Text size="xs" c="dimmed">
            Anyone with the link can view your profile
          </Text>
        </div>
        <Popover 
          opened={popoverOpened} 
          onClose={() => setPopoverOpened(false)}
          position="bottom"
          withArrow
        >
          <Popover.Target>
            <Switch
              checked={checked}
              onClick={handleSwitchClick}
              data-testid="public-profile-switch"
              aria-labelledby="public-profile-label"
              aria-checked={checked}
              readOnly
            />
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm" mb="md">
              Are you sure you want to make your profile private?
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" size="xs" onClick={handleCancel}>
                Cancel
              </Button>
              <Button color="red" size="xs" onClick={handleConfirm}>
                Turn off
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </div>
    </Card>
  );
}
