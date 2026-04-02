'use client';

/**
 * accordion-mantine-T03: Preferences: collapse all sections
 * 
 * A centered isolated card titled "Preferences" contains a Mantine Accordion with 5 items: 
 * "General", "Appearance", "Notifications", "Privacy", "Advanced". Initial state: "General" 
 * is expanded by default; others collapsed. There is no separate reset button; collapsing 
 * the open item returns the accordion to the all-collapsed state.
 * 
 * Success: expanded_item_ids equals exactly: []
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('general');

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Preferences</Text>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        <Accordion.Item value="general">
          <Accordion.Control>General</Accordion.Control>
          <Accordion.Panel>
            General application settings including language and region preferences.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="appearance">
          <Accordion.Control>Appearance</Accordion.Control>
          <Accordion.Panel>
            Customize the look and feel of the application.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="notifications">
          <Accordion.Control>Notifications</Accordion.Control>
          <Accordion.Panel>
            Configure email and push notification settings.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="privacy">
          <Accordion.Control>Privacy</Accordion.Control>
          <Accordion.Panel>
            Manage your privacy settings and data preferences.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="advanced">
          <Accordion.Control>Advanced</Accordion.Control>
          <Accordion.Panel>
            Advanced options for power users.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
