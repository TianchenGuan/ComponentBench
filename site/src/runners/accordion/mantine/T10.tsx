'use client';

/**
 * accordion-mantine-T10: Dashboard (3 accordions): open Slack in Integrations
 * 
 * Scene is a dashboard layout with medium clutter: multiple cards (KPIs, recent activity 
 * list, and a small toolbar) surround the target area. There are THREE Mantine Accordion 
 * instances displayed as separate cards in a row:
 * • "Integrations"
 * • "Billing"
 * • "Security"
 * Each card contains its own accordion with 4 items. Initial state: all items in all 
 * three accordions are collapsed. The task targets only the Integrations accordion.
 * 
 * Success: Integrations accordion has expanded_item_ids exactly: [slack]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, Box, Grid, Group, Paper, Badge, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [integrationsValue, setIntegrationsValue] = useState<string | null>(null);
  const [billingValue, setBillingValue] = useState<string | null>(null);
  const [securityValue, setSecurityValue] = useState<string | null>(null);

  useEffect(() => {
    if (integrationsValue === 'slack') {
      onSuccess();
    }
  }, [integrationsValue, onSuccess]);

  const integrationItems = [
    { value: 'slack', label: 'Slack' },
    { value: 'github', label: 'GitHub' },
    { value: 'jira', label: 'Jira' },
    { value: 'webhooks', label: 'Webhooks' },
  ];

  const billingItems = [
    { value: 'invoices', label: 'Invoices' },
    { value: 'receipts', label: 'Receipts' },
    { value: 'payment_methods', label: 'Payment methods' },
    { value: 'tax_forms', label: 'Tax forms' },
  ];

  const securityItems = [
    { value: 'sso', label: 'SSO' },
    { value: 'audit_log', label: 'Audit log' },
    { value: 'api_keys', label: 'API keys' },
    { value: 'sessions', label: 'Sessions' },
  ];

  return (
    <Box style={{ width: '100%', maxWidth: 1100 }}>
      {/* Dashboard header */}
      <Group justify="space-between" mb="md">
        <Text fw={600} size="xl">Dashboard</Text>
        <Group gap="xs">
          <Button variant="light" size="xs" disabled>Export</Button>
          <Button variant="light" size="xs" disabled>Settings</Button>
        </Group>
      </Group>

      {/* KPI tiles (clutter) */}
      <Grid mb="md">
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">Total Users</Text>
            <Text size="xl" fw={700}>1,234</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">Active Now</Text>
            <Text size="xl" fw={700}>89</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">Storage</Text>
            <Text size="xl" fw={700}>72%</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">API Calls</Text>
            <Text size="xl" fw={700}>45.2K</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Recent activity (clutter) */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Text fw={500} mb="xs">Recent Activity</Text>
        <Group gap="xs">
          <Badge variant="light" color="blue">User signed up</Badge>
          <Badge variant="light" color="green">Payment received</Badge>
          <Badge variant="light" color="yellow">API key created</Badge>
        </Group>
      </Card>

      {/* Three accordion cards in a row */}
      <Grid>
        {/* Integrations accordion - the target */}
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder data-testid="integrations">
            <Text fw={600} mb="sm">Integrations</Text>
            <Accordion 
              value={integrationsValue} 
              onChange={setIntegrationsValue}
              data-testid="accordion-integrations"
            >
              {integrationItems.map(item => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control>{item.label}</Accordion.Control>
                  <Accordion.Panel>
                    Configure {item.label} integration settings.
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>
        </Grid.Col>

        {/* Billing accordion */}
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder data-testid="billing">
            <Text fw={600} mb="sm">Billing</Text>
            <Accordion 
              value={billingValue} 
              onChange={setBillingValue}
              data-testid="accordion-billing"
            >
              {billingItems.map(item => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control>{item.label}</Accordion.Control>
                  <Accordion.Panel>
                    Manage {item.label.toLowerCase()} settings.
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>
        </Grid.Col>

        {/* Security accordion */}
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder data-testid="security">
            <Text fw={600} mb="sm">Security</Text>
            <Accordion 
              value={securityValue} 
              onChange={setSecurityValue}
              data-testid="accordion-security"
            >
              {securityItems.map(item => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control>{item.label}</Accordion.Control>
                  <Accordion.Panel>
                    Configure {item.label.toLowerCase()} settings.
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
