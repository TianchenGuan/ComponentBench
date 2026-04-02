'use client';

/**
 * checkbox-mantine-T08: Scroll to enable calendar access
 *
 * Layout: form section titled "Integrations".
 * The page contains three Mantine Checkbox rows separated by descriptive text blocks:
 *   - "Allow contacts access" (initially unchecked) near the top
 *   - "Allow file access" (initially checked) in the middle
 *   - "Allow calendar access" (initially unchecked) near the bottom and initially off-screen
 * You must scroll down to reveal the target checkbox. There is no Save/Apply button; the checkbox state commits immediately.
 * Clutter: headings, helper paragraphs, and dividers increase visual density but do not affect success.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox, Divider, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [contactsAccess, setContactsAccess] = useState(false);
  const [fileAccess, setFileAccess] = useState(true);
  const [calendarAccess, setCalendarAccess] = useState(false);

  const handleCalendarAccessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setCalendarAccess(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">
        Integrations
      </Text>
      
      <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Checkbox
          checked={contactsAccess}
          onChange={(e) => setContactsAccess(e.currentTarget.checked)}
          label="Allow contacts access"
          data-testid="cb-contacts-access"
        />
        <Text size="sm" c="dimmed">
          Let third-party apps access your contact list for easier sharing and collaboration.
        </Text>

        <Divider />

        <Checkbox
          checked={fileAccess}
          onChange={(e) => setFileAccess(e.currentTarget.checked)}
          label="Allow file access"
          data-testid="cb-file-access"
        />
        <Text size="sm" c="dimmed">
          Enable connected apps to read and write files in your storage.
        </Text>

        <Divider />

        {/* Spacer to push content below fold */}
        <Box style={{ height: 150 }} />

        <Text fw={500}>Additional Permissions</Text>
        <Text size="sm" c="dimmed">
          These permissions allow deeper integration with external services.
        </Text>

        {/* More spacer */}
        <Box style={{ height: 150 }} />

        {/* Target checkbox */}
        <Checkbox
          checked={calendarAccess}
          onChange={handleCalendarAccessChange}
          label="Allow calendar access"
          data-testid="cb-calendar-access"
        />
        <Text size="sm" c="dimmed">
          Sync your calendar events with integrated applications.
        </Text>
      </Box>
    </Card>
  );
}
