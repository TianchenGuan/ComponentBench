'use client';

/**
 * json_editor-mantine-T09: Add Slack integration object in a dashboard scene
 *
 * Page uses a dashboard layout with multiple Mantine Cards (stats, recent events, and logs) as distractors.
 * One card in the dashboard is titled "Integrations (JSON)". This card contains the only JSON editor relevant to the task.
 * The JSON editor starts in Tree mode and includes a search field in its toolbar (placeholder "Search…").
 * Below the editor is a Save button.
 * Initial JSON value:
 * {
 *   "integrations": {
 *     "email": {"enabled": true, "address": "alerts@example.com"},
 *     "pagerduty": {"enabled": false}
 *   }
 * }
 * You must add a new object integrations.slack with fields enabled=true and channel="#alerts".
 *
 * Success: The committed JSON value at path $.integrations.slack equals { "enabled": true, "channel": "#alerts" } after Save.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Switch, Stack, Group, Box, Grid, Card, Badge, Accordion } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, jsonEquals } from '../types';

const INITIAL_JSON = {
  integrations: {
    email: { enabled: true, address: 'alerts@example.com' },
    pagerduty: { enabled: false }
  }
};

const TARGET_SLACK = { enabled: true, channel: '#alerts' };

export default function T09({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [searchTerm, setSearchTerm] = useState('');
  const [newIntegration, setNewIntegration] = useState({ name: '', enabled: true, extra: '' });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const slack = getJsonPath(committedValue, '$.integrations.slack');
    if (slack && jsonEquals(slack, TARGET_SLACK)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleSave = () => {
    setCommittedValue(jsonValue);
  };

  const addSlackIntegration = () => {
    const obj = jsonValue as typeof INITIAL_JSON;
    setJsonValue({
      ...obj,
      integrations: {
        ...obj.integrations,
        slack: { enabled: true, channel: '' }
      }
    });
  };

  const updateIntegrationField = (integration: string, field: string, value: JsonValue) => {
    const obj = jsonValue as typeof INITIAL_JSON;
    const integrations = obj.integrations as Record<string, Record<string, JsonValue>>;
    setJsonValue({
      ...obj,
      integrations: {
        ...integrations,
        [integration]: {
          ...integrations[integration],
          [field]: value
        }
      }
    });
  };

  const obj = jsonValue as { integrations: Record<string, Record<string, JsonValue>> };
  const integrationsList = Object.entries(obj.integrations);

  return (
    <Grid gutter="md" style={{ maxWidth: 900 }}>
      {/* Distractor cards */}
      <Grid.Col span={4}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} mb="xs">Stats</Text>
          <Group gap="xs">
            <Badge color="blue">Users: 1,234</Badge>
            <Badge color="green">Active: 987</Badge>
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} mb="xs">Recent Events</Text>
          <Text size="xs" c="dimmed">No recent events</Text>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} mb="xs">Logs</Text>
          <Text size="xs" c="dimmed">System running normally</Text>
        </Card>
      </Grid.Col>

      {/* Main JSON editor card */}
      <Grid.Col span={12}>
        <Paper shadow="sm" p="lg" radius="md" withBorder data-testid="json-editor-card">
          <Text fw={600} size="lg" mb="md">Integrations (JSON)</Text>

          <TextInput
            placeholder="Search…"
            leftSection={<IconSearch size={14} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="xs"
            mb="md"
            style={{ width: 200 }}
            data-testid="search-input"
          />

          <Box style={{ border: '1px solid #dee2e6', borderRadius: 4, padding: 12, background: '#f8f9fa' }} mb="md">
            <Text size="sm" ff="monospace" mb="xs">integrations:</Text>
            <Accordion variant="filled" multiple defaultValue={['email']}>
              {integrationsList
                .filter(([name]) => !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(([name, config]) => (
                  <Accordion.Item key={name} value={name}>
                    <Accordion.Control>
                      <Text size="sm" ff="monospace">{name}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs" pl="md">
                        {Object.entries(config).map(([field, value]) => (
                          <Group key={field} gap="xs">
                            <Text size="xs" ff="monospace" w={70}>{field}:</Text>
                            {typeof value === 'boolean' ? (
                              <Switch
                                size="xs"
                                checked={value}
                                onChange={(e) => updateIntegrationField(name, field, e.currentTarget.checked)}
                              />
                            ) : (
                              <TextInput
                                size="xs"
                                value={String(value)}
                                onChange={(e) => updateIntegrationField(name, field, e.target.value)}
                                style={{ width: 180 }}
                                data-testid={`${name}-${field}`}
                              />
                            )}
                          </Group>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
            </Accordion>

            {!obj.integrations.slack && (
              <Button variant="subtle" size="xs" mt="sm" onClick={addSlackIntegration}>
                + Add slack integration
              </Button>
            )}
          </Box>

          <Button onClick={handleSave}>Save</Button>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
