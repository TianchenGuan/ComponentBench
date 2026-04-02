'use client';

/**
 * menu_button-mantine-T03: Set Shipping method to Express
 * 
 * Layout: form_section centered titled "Checkout".
 * There are two menu buttons (instances=2):
 * "Shipping method: Standard" and "Billing method: Invoice".
 * Each dropdown contains: "Standard", "Express", "Pickup".
 * 
 * Clutter (low): text inputs for Address and City and a disabled "Place order" button.
 * Initial state: Shipping=Standard, Billing=Invoice.
 * Success: The "Shipping method" menu button has selected value "Express".
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text, TextInput, Stack } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const methods = ['Standard', 'Express', 'Pickup'];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [billingMethod, setBillingMethod] = useState('Invoice');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (shippingMethod === 'Express' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [shippingMethod, successTriggered, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Checkout</Text>
      
      <Stack gap="md">
        <div>
          <Text size="sm" c="dimmed" mb={4}>Shipping method</Text>
          <Menu>
            <Menu.Target>
              <Button
                variant="default"
                rightSection={<IconChevronDown size={16} />}
                data-testid="menu-button-shipping-method"
                fullWidth
                styles={{ inner: { justifyContent: 'space-between' } }}
              >
                Shipping method: {shippingMethod}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {methods.map(method => (
                <Menu.Item
                  key={method}
                  onClick={() => setShippingMethod(method)}
                >
                  {method}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>

        <div>
          <Text size="sm" c="dimmed" mb={4}>Billing method</Text>
          <Menu>
            <Menu.Target>
              <Button
                variant="default"
                rightSection={<IconChevronDown size={16} />}
                data-testid="menu-button-billing-method"
                fullWidth
                styles={{ inner: { justifyContent: 'space-between' } }}
              >
                Billing method: {billingMethod}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {methods.map(method => (
                <Menu.Item
                  key={method}
                  onClick={() => setBillingMethod(method)}
                >
                  {method}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* Clutter: non-functional controls */}
        <TextInput label="Address" placeholder="Enter address" disabled />
        <TextInput label="City" placeholder="Enter city" disabled />
        
        <Button disabled>Place order</Button>
      </Stack>
    </Card>
  );
}
