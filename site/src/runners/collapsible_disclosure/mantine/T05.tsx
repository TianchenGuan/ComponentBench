'use client';

/**
 * collapsible_disclosure-mantine-T05: Two instances: expand API keys in Advanced
 * 
 * Two accordion cards are shown one after another in the same centered region.
 * 
 * - Layout: isolated_card.
 * - Instances: 2 Mantine Accordions with clear headings:
 *   - "General"
 *   - "Advanced"  ← TARGET INSTANCE
 * - Each accordion has 3 items. The "Advanced" accordion includes: "API keys", "Webhooks", "Rate limits".
 * - Initial state:
 *   - General: all collapsed
 *   - Advanced: all collapsed
 * - No other controls are required; the main challenge is selecting the correct instance.
 * 
 * Success: In "Advanced", "API keys" is expanded
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Text, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [generalValue, setGeneralValue] = useState<string | null>(null);
  const [advancedValue, setAdvancedValue] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when Advanced has "API keys" expanded AND General remains unchanged
    if (advancedValue === 'api_keys' && generalValue === null && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [advancedValue, generalValue, onSuccess]);

  return (
    <Stack gap="lg" style={{ width: 500 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder data-testid="general-accordion">
        <Text fw={600} size="lg" mb="md">General</Text>
        
        <Accordion value={generalValue} onChange={setGeneralValue}>
          <Accordion.Item value="account">
            <Accordion.Control>Account</Accordion.Control>
            <Accordion.Panel>
              Manage your account settings and preferences.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="notifications">
            <Accordion.Control>Notifications</Accordion.Control>
            <Accordion.Panel>
              Configure notification preferences.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="appearance">
            <Accordion.Control>Appearance</Accordion.Control>
            <Accordion.Panel>
              Theme and display options.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder data-testid="advanced-accordion">
        <Text fw={600} size="lg" mb="md">Advanced</Text>
        
        <Accordion value={advancedValue} onChange={setAdvancedValue}>
          <Accordion.Item value="api_keys">
            <Accordion.Control>API keys</Accordion.Control>
            <Accordion.Panel>
              Manage your API keys and access tokens for integration.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="webhooks">
            <Accordion.Control>Webhooks</Accordion.Control>
            <Accordion.Panel>
              Configure webhook endpoints and events.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="rate_limits">
            <Accordion.Control>Rate limits</Accordion.Control>
            <Accordion.Panel>
              View and manage API rate limits.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
    </Stack>
  );
}
