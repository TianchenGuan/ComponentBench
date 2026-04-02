'use client';

/**
 * json_editor-mantine-T06: Match formatting options to a visual reference
 *
 * Page shows a centered Mantine Card titled "Formatter options (JSON)".
 * The card is split into two areas:
 * - Left: one editable JSON editor (starts in Tree mode) with a Save button underneath.
 * - Right: a read-only card labeled "Reference JSON" showing the desired final JSON as formatted text.
 * Initial editable JSON:
 * {
 *   "format": {"pretty": false, "indent": 4},
 *   "sortKeys": false
 * }
 * Reference JSON shown on the right:
 * {
 *   "format": {"pretty": true, "indent": 2},
 *   "sortKeys": true
 * }
 *
 * Success: The committed JSON document equals the reference JSON (object key order ignored) after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Switch, Stack, Group, Box, Accordion, Grid, Code } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const INITIAL_JSON = {
  format: { pretty: false, indent: 4 },
  sortKeys: false
};

const TARGET_JSON = {
  format: { pretty: true, indent: 2 },
  sortKeys: true
};

export default function T06({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (jsonEquals(committedValue, TARGET_JSON)) {
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

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 650 }} data-testid="json-editor-card">
      <Text fw={600} size="lg" mb="md">Formatter options (JSON)</Text>

      <Grid>
        <Grid.Col span={7}>
          <Box style={{ border: '1px solid #dee2e6', borderRadius: 4, padding: 12, background: '#f8f9fa' }} mb="sm">
            <Accordion defaultValue="format" variant="filled">
              <Accordion.Item value="format">
                <Accordion.Control>
                  <Text size="sm" ff="monospace">format</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs" pl="md">
                    <Group gap="xs">
                      <Text size="sm" ff="monospace" w={70}>pretty:</Text>
                      <Switch
                        size="sm"
                        checked={obj.format.pretty}
                        onChange={(e) => updateJsonPath(['format', 'pretty'], e.currentTarget.checked)}
                      />
                    </Group>
                    <Group gap="xs">
                      <Text size="sm" ff="monospace" w={70}>indent:</Text>
                      <TextInput
                        size="xs"
                        type="number"
                        value={obj.format.indent}
                        onChange={(e) => updateJsonPath(['format', 'indent'], Number(e.target.value))}
                        style={{ width: 80 }}
                        data-testid="input-indent"
                      />
                    </Group>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Group gap="xs" mt="sm">
              <Text size="sm" ff="monospace" w={80}>sortKeys:</Text>
              <Switch
                size="sm"
                checked={obj.sortKeys}
                onChange={(e) => updateJsonPath(['sortKeys'], e.currentTarget.checked)}
              />
            </Group>
          </Box>
          <Button onClick={handleSave}>Save</Button>
        </Grid.Col>

        <Grid.Col span={5}>
          <Box style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, height: '100%', border: '1px solid #e0e0e0' }}>
            <Text fw={500} size="sm" mb="xs">Reference JSON</Text>
            <Code block style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(TARGET_JSON, null, 2)}
            </Code>
          </Box>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
