'use client';

/**
 * json_editor-mantine-T08: Scroll to find experimental.searchV2 in compact mode
 *
 * The JSON editor card is anchored near the top-left of the viewport.
 * The page uses compact spacing (reduced padding and tighter rows) for the editor area.
 * A Mantine Card titled "Features (JSON)" contains a single JSON editor starting in Tree mode.
 * The JSON document is long and requires scrolling inside the editor to reach lower sections.
 * The nested object features.experimental appears far down the tree.
 * A Save button is located below the editor.
 * The JSON includes features.experimental.searchV2 which must be set to true.
 *
 * Success: The committed JSON value at path $.features.experimental.searchV2 equals true after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, Switch, Stack, Group, Box, ScrollArea, Accordion } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

// Generate a long JSON with experimental deeply nested
const generateInitialJson = () => ({
  general: { name: 'MyApp', version: '2.0.0' },
  database: { host: 'localhost', port: 5432 },
  cache: { enabled: true, ttl: 300 },
  logging: { level: 'info', format: 'json' },
  auth: { provider: 'oauth', timeout: 3600 },
  api: { baseUrl: '/api', retries: 3 },
  monitoring: { enabled: true, interval: 60 },
  notifications: { email: true, slack: false },
  storage: { type: 's3', bucket: 'data' },
  features: {
    experimental: {
      searchV2: false,
      checkoutV3: false
    }
  }
});

const INITIAL_JSON = generateInitialJson();

export default function T08({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const searchV2 = getJsonPath(committedValue, '$.features.experimental.searchV2');
    if (searchV2 === true) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleSave = () => {
    setCommittedValue(jsonValue);
  };

  const updateJsonPath = (path: string[], value: JsonValue) => {
    const newJson = JSON.parse(JSON.stringify(jsonValue));
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJsonValue(newJson);
  };

  const obj = jsonValue as typeof INITIAL_JSON;

  const renderSection = (key: string, value: Record<string, JsonValue>, level: number = 0) => {
    const entries = Object.entries(value);
    return (
      <Accordion.Item key={key} value={key}>
        <Accordion.Control>
          <Text size="xs" ff="monospace">{key}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap={4} pl={level > 0 ? 'md' : undefined}>
            {entries.map(([k, v]) => {
              if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                return renderSection(k, v as Record<string, JsonValue>, level + 1);
              }
              if (typeof v === 'boolean') {
                return (
                  <Group key={k} gap={4}>
                    <Text size="xs" ff="monospace" w={80}>{k}:</Text>
                    <Switch
                      size="xs"
                      checked={v}
                      onChange={(e) => {
                        const path = level === 0 ? [key, k] : ['features', 'experimental', k];
                        updateJsonPath(path, e.currentTarget.checked);
                      }}
                      data-testid={`switch-${key}-${k}`}
                    />
                  </Group>
                );
              }
              return (
                <Group key={k} gap={4}>
                  <Text size="xs" ff="monospace" w={80}>{k}:</Text>
                  <Text size="xs" ff="monospace">{JSON.stringify(v)}</Text>
                </Group>
              );
            })}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    );
  };

  return (
    <Paper shadow="sm" p="sm" radius="md" withBorder style={{ width: 400 }} data-testid="json-editor-card">
      <Text fw={600} size="md" mb="xs">Features (JSON)</Text>

      <ScrollArea h={280} mb="sm" style={{ border: '1px solid #dee2e6', borderRadius: 4, padding: 4 }}>
        <Accordion multiple variant="contained" defaultValue={[]}>
          {Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return renderSection(key, value as Record<string, JsonValue>);
            }
            return null;
          })}
        </Accordion>
      </ScrollArea>

      <Button size="xs" onClick={handleSave}>Save</Button>
    </Paper>
  );
}
