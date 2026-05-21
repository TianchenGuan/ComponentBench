'use client';

/**
 * clipboard_copy-mantine-T07: Open copy menu and select Copy as JSON
 *
 * Layout: isolated_card, centered.
 * The card title is "Export user". It displays a small preview of the user object (ID and role) and a button group on the right:
 * - A button labeled "Copy" with a dropdown arrow opens a Mantine Menu.
 *
 * Menu options (each triggers clipboard write via useClipboard.copy):
 * - Copy as text
 * - Copy as JSON   (target)
 * - Copy as CSV
 * - Copy as URL
 *
 * The JSON payload that should be copied is shown in a small code preview under "JSON preview":
 * {"id":"u_128","role":"admin"}
 *
 * Component behavior:
 * - Selecting "Copy as JSON" writes the exact JSON string to the clipboard and closes the menu.
 * - A small notification "Copied" appears in the top-right corner of the card.
 *
 * Distractors: a "Download" button next to Copy that does nothing relevant.
 * Initial state: menu closed; nothing copied.
 *
 * Success: Clipboard text equals the exact JSON string {"id":"u_128","role":"admin"}.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Menu, Group, Notification, Box, Stack, Code } from '@mantine/core';
import { IconChevronDown, IconDownload, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const userData = { id: 'u_128', role: 'admin' };
const jsonString = '{"id":"u_128","role":"admin"}';

const copyOptions = [
  { label: 'Copy as text', getValue: () => `ID: ${userData.id}, Role: ${userData.role}` },
  { label: 'Copy as JSON', getValue: () => jsonString },  // target
  { label: 'Copy as CSV', getValue: () => 'id,role\nu_128,admin' },
  { label: 'Copy as URL', getValue: () => `?id=${userData.id}&role=${userData.role}` },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleCopy = async (label: string, value: string) => {
    await copyToClipboard(value, label);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);

    // Only complete if JSON was copied
    if (value === jsonString && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, position: 'relative' }} data-testid="export-card">
      <Text fw={500} size="lg" mb="md">Export user</Text>
      
      <Stack gap="md">
        {/* User preview */}
        <Box p="sm" style={{ background: '#f8f9fa', borderRadius: 8 }}>
          <Text size="sm" c="dimmed" mb={4}>User object:</Text>
          <Text size="sm">ID: {userData.id}</Text>
          <Text size="sm">Role: {userData.role}</Text>
        </Box>

        {/* JSON preview */}
        <Box>
          <Text size="xs" c="dimmed" mb={4}>JSON preview:</Text>
          <Code block data-testid="json-preview">{jsonString}</Code>
        </Box>

        {/* Action buttons */}
        <Group>
          <Menu shadow="md" width={200} data-testid="copy-menu">
            <Menu.Target>
              <Button rightSection={<IconChevronDown size={14} />} data-testid="copy-menu-button">
                Copy
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {copyOptions.map((option) => (
                <Menu.Item
                  key={option.label}
                  onClick={() => handleCopy(option.label, option.getValue())}
                  data-testid={`menu-${option.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {option.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <Button variant="subtle" leftSection={<IconDownload size={16} />} data-testid="download-button">
            Download
          </Button>
        </Group>
      </Stack>

      {/* Success notification */}
      {showNotification && (
        <Notification
          icon={<IconCheck size={16} />}
          color="teal"
          title="Copied"
          onClose={() => setShowNotification(false)}
          style={{ position: 'absolute', top: 16, right: 16 }}
        >
          Content copied to clipboard
        </Notification>
      )}
    </Card>
  );
}
