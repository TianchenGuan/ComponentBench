'use client';

/**
 * radio_group-mantine-T07: Delivery form: expand Advanced delivery and choose Evening window
 *
 * A form_section layout titled "Delivery" contains a Mantine Accordion with two panels: "Basics" (expanded) and "Advanced delivery" (collapsed).
 * Basics includes a non-target Radio.Group labeled "Shipping speed" (Standard / Express) to increase instance confusion.
 * The target Radio.Group labeled "Delivery window" is inside the "Advanced delivery" panel and is hidden until expanded.
 * Delivery window options: Morning, Afternoon, Evening, Anytime.
 * Initial state (when revealed): Anytime is selected.
 * There are additional clutter elements (a text input for "Delivery notes" and a toggle "Require signature") but they are not needed.
 * Selecting a window auto-saves; a small "Saved" helper text appears after a short delay.
 *
 * Success: For the "Delivery window" Radio.Group instance, the selected value equals "evening" (label "Evening").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Stack, Accordion, TextInput, Switch, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [shippingSpeed, setShippingSpeed] = useState<string>('standard');
  const [deliveryWindow, setDeliveryWindow] = useState<string>('anytime');
  const [saved, setSaved] = useState(false);

  const handleDeliveryWindowChange = (value: string) => {
    setDeliveryWindow(value);
    setSaved(true);
    if (value === 'evening') {
      onSuccess();
    }
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">Delivery</Text>

      <Accordion defaultValue="basics">
        <Accordion.Item value="basics">
          <Accordion.Control>Basics</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <div data-instance="Shipping speed">
                <Radio.Group
                  data-canonical-type="radio_group"
                  data-selected-value={shippingSpeed}
                  value={shippingSpeed}
                  onChange={setShippingSpeed}
                  label="Shipping speed"
                >
                  <Stack gap="xs" mt="xs">
                    <Radio value="standard" label="Standard" />
                    <Radio value="express" label="Express" />
                  </Stack>
                </Radio.Group>
              </div>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="advanced">
          <Accordion.Control>Advanced delivery</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <div data-instance="Delivery window">
                <Radio.Group
                  data-canonical-type="radio_group"
                  data-selected-value={deliveryWindow}
                  value={deliveryWindow}
                  onChange={handleDeliveryWindowChange}
                  label="Delivery window"
                >
                  <Stack gap="xs" mt="xs">
                    <Radio value="morning" label="Morning" />
                    <Radio value="afternoon" label="Afternoon" />
                    <Radio value="evening" label="Evening" />
                    <Radio value="anytime" label="Anytime" />
                  </Stack>
                </Radio.Group>
                {saved && <Text size="xs" c="green" mt="xs">Saved</Text>}
              </div>

              <TextInput label="Delivery notes" placeholder="Special instructions..." />
              
              <Group justify="space-between">
                <Text size="sm">Require signature</Text>
                <Switch />
              </Group>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
