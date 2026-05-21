'use client';

/**
 * menu_button-mantine-T09: Set Alert sound to Chime and apply
 * 
 * Layout: settings_panel centered titled "Sounds". Spacing is compact.
 * There are two similar menu buttons (instances=2):
 * "Notification sound: Pop" and "Alert sound: Beep".
 * 
 * Opening either shows a single-select list of sounds:
 * "Beep", "Chime", "Pop", "None".
 * At the bottom of the dropdown is a footer with "Cancel" and primary "Apply".
 * Selecting a sound only stages the selection until Apply is clicked.
 * 
 * Clutter (medium): sliders for volume and a mute toggle.
 * 
 * Initial state: Notification=Pop, Alert=Beep.
 * Success: For "Alert sound", the applied value equals "Chime".
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text, Stack, Slider, Switch, Box, Group } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const sounds = ['Beep', 'Chime', 'Pop', 'None'];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [notificationApplied, setNotificationApplied] = useState('Pop');
  const [notificationStaged, setNotificationStaged] = useState('Pop');
  const [alertApplied, setAlertApplied] = useState('Beep');
  const [alertStaged, setAlertStaged] = useState('Beep');
  const [notificationOpened, setNotificationOpened] = useState(false);
  const [alertOpened, setAlertOpened] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (alertApplied === 'Chime' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [alertApplied, successTriggered, onSuccess]);

  const handleNotificationApply = () => {
    setNotificationApplied(notificationStaged);
    setNotificationOpened(false);
  };

  const handleNotificationCancel = () => {
    setNotificationStaged(notificationApplied);
    setNotificationOpened(false);
  };

  const handleAlertApply = () => {
    setAlertApplied(alertStaged);
    setAlertOpened(false);
  };

  const handleAlertCancel = () => {
    setAlertStaged(alertApplied);
    setAlertOpened(false);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Sounds</Text>
      
      <Stack gap="sm">
        <div>
          <Text size="sm" c="dimmed" mb={4}>Notification sound</Text>
          <Menu opened={notificationOpened} onChange={setNotificationOpened}>
            <Menu.Target>
              <Button
                variant="default"
                size="sm"
                rightSection={<IconChevronDown size={14} />}
                data-testid="menu-button-notification-sound"
                fullWidth
                styles={{ inner: { justifyContent: 'space-between' } }}
              >
                Notification sound: {notificationApplied}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {sounds.map(sound => (
                <Menu.Item
                  key={sound}
                  onClick={() => setNotificationStaged(sound)}
                  bg={notificationStaged === sound ? 'blue.0' : undefined}
                >
                  {sound}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Group justify="flex-end" p="xs" gap="xs">
                <Button size="xs" variant="default" onClick={handleNotificationCancel}>
                  Cancel
                </Button>
                <Button size="xs" onClick={handleNotificationApply}>
                  Apply
                </Button>
              </Group>
            </Menu.Dropdown>
          </Menu>
        </div>

        <div>
          <Text size="sm" c="dimmed" mb={4}>Alert sound</Text>
          <Menu opened={alertOpened} onChange={setAlertOpened}>
            <Menu.Target>
              <Button
                variant="default"
                size="sm"
                rightSection={<IconChevronDown size={14} />}
                data-testid="menu-button-alert-sound"
                fullWidth
                styles={{ inner: { justifyContent: 'space-between' } }}
              >
                Alert sound: {alertApplied}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {sounds.map(sound => (
                <Menu.Item
                  key={sound}
                  onClick={() => setAlertStaged(sound)}
                  bg={alertStaged === sound ? 'blue.0' : undefined}
                >
                  {sound}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Group justify="flex-end" p="xs" gap="xs">
                <Button size="xs" variant="default" onClick={handleAlertCancel} data-testid="alert-sound-cancel">
                  Cancel
                </Button>
                <Button size="xs" onClick={handleAlertApply} data-testid="alert-sound-apply">
                  Apply
                </Button>
              </Group>
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* Clutter: unrelated controls */}
        <div>
          <Text size="sm" c="dimmed" mb={4}>Volume</Text>
          <Slider defaultValue={70} disabled />
        </div>
        
        <Switch label="Mute all sounds" size="sm" />
      </Stack>
    </Card>
  );
}
