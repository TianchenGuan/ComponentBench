'use client';

/**
 * time_input_text-mantine-T09: Set Reminder 2 time among three reminders in dark settings
 * 
 * Layout: settings_panel in dark theme, comfortable spacing.
 * A "Reminders" settings section shows three Mantine TimeInput fields (native time inputs) labeled:
 * - "Reminder 1 time" (20:00)
 * - "Reminder 2 time" (21:00)  ← TARGET
 * - "Reminder 3 time" (22:00)
 * All fields use minute precision.
 * Clutter=medium: there are also three unrelated toggles (Sound/Vibrate/Snooze) and a help link.
 * Only the value of Reminder 2 time determines success.
 * 
 * Success: The TimeInput instance labeled "Reminder 2 time" equals 21:10.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Switch, Anchor, MantineProvider, createTheme } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  primaryColor: 'blue',
});

export default function T09({ onSuccess }: TaskComponentProps) {
  const [reminder1, setReminder1] = useState('20:00');
  const [reminder2, setReminder2] = useState('21:00');
  const [reminder3, setReminder3] = useState('22:00');
  const [sound, setSound] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [snooze, setSnooze] = useState(false);

  useEffect(() => {
    if (reminder2 === '21:10') {
      onSuccess();
    }
  }, [reminder2, onSuccess]);

  return (
    <MantineProvider theme={darkTheme} forceColorScheme="dark">
      <Card 
        shadow="sm" 
        padding="lg" 
        radius="md" 
        withBorder 
        style={{ width: 400 }}
        bg="dark.7"
      >
        <Text fw={600} size="lg" mb="md" c="white">Reminders</Text>
        
        <Stack gap="md">
          <div>
            <Text component="label" htmlFor="reminder-1-time" fw={500} size="sm" mb={4} style={{ display: 'block' }} c="white">
              Reminder 1 time
            </Text>
            <TimeInput
              id="reminder-1-time"
              value={reminder1}
              onChange={(event) => setReminder1(event.currentTarget.value)}
              data-testid="reminder-1-time"
            />
          </div>
          
          <div>
            <Text component="label" htmlFor="reminder-2-time" fw={500} size="sm" mb={4} style={{ display: 'block' }} c="white">
              Reminder 2 time
            </Text>
            <TimeInput
              id="reminder-2-time"
              value={reminder2}
              onChange={(event) => setReminder2(event.currentTarget.value)}
              data-testid="reminder-2-time"
            />
          </div>
          
          <div>
            <Text component="label" htmlFor="reminder-3-time" fw={500} size="sm" mb={4} style={{ display: 'block' }} c="white">
              Reminder 3 time
            </Text>
            <TimeInput
              id="reminder-3-time"
              value={reminder3}
              onChange={(event) => setReminder3(event.currentTarget.value)}
              data-testid="reminder-3-time"
            />
          </div>
          
          <Stack gap="xs" mt="md">
            <Switch
              label="Sound"
              checked={sound}
              onChange={(event) => setSound(event.currentTarget.checked)}
              styles={{ label: { color: 'white' } }}
            />
            <Switch
              label="Vibrate"
              checked={vibrate}
              onChange={(event) => setVibrate(event.currentTarget.checked)}
              styles={{ label: { color: 'white' } }}
            />
            <Switch
              label="Snooze"
              checked={snooze}
              onChange={(event) => setSnooze(event.currentTarget.checked)}
              styles={{ label: { color: 'white' } }}
            />
          </Stack>
          
          <Anchor size="sm" mt="xs">Need help?</Anchor>
        </Stack>
      </Card>
    </MantineProvider>
  );
}
