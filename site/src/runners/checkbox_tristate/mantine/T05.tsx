'use client';

/**
 * checkbox_tristate-mantine-T05: Accordion: set Search indexing to Partial
 *
 * Layout: form_section titled "Privacy", centered, using Mantine Accordion.
 * Accordion items:
 * - "Visibility"
 * - "Indexing" (contains the target)
 * - "Data export"
 *
 * Initially, the "Visibility" item is open and "Indexing" is collapsed.
 * Inside the "Indexing" accordion panel is one Mantine tri-state checkbox
 * labeled "Search indexing" with a brief description ("Allow partial indexing for shared pages").
 * Initial state: Unchecked.
 *
 * Clutter: medium. Other accordion panels contain unrelated toggles and a link.
 * 
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Accordion, Switch, Anchor, Stack } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} mb="md">Privacy</Text>
      
      <Accordion defaultValue="visibility">
        <Accordion.Item value="visibility">
          <Accordion.Control>Visibility</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <Switch label="Show profile publicly" defaultChecked />
              <Switch label="Allow mentions" />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="indexing">
          <Accordion.Control>Indexing</Accordion.Control>
          <Accordion.Panel>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
              <Checkbox
                checked={state === 'checked'}
                indeterminate={state === 'indeterminate'}
                label="Search indexing"
                data-testid="search-indexing-checkbox"
                readOnly
              />
            </div>
            <Text size="xs" c="dimmed" mt="xs" ml={28}>
              Allow partial indexing for shared pages
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="export">
          <Accordion.Control>Data export</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" mb="sm">Download your data in various formats.</Text>
            <Anchor size="sm">Request data export</Anchor>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
