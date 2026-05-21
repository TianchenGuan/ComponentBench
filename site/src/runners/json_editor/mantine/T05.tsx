'use client';

/**
 * json_editor-mantine-T05: Set preferences.locale in User overrides (two editors)
 *
 * Page shows a centered Mantine Card titled "User preferences".
 * Inside the card are TWO JSON editor instances:
 * 1) "Default preferences (JSON)"
 * 2) "User overrides (JSON)"
 * Each editor starts in Tree mode and has its own Save button below it.
 * Initial JSON in Default preferences:
 * {
 *   "preferences": {"locale": "en-US", "timezone": "UTC"}
 * }
 * Initial JSON in User overrides:
 * {
 *   "preferences": {"locale": "en-US", "timezone": "America/New_York"}
 * }
 * You must edit only the User overrides editor.
 *
 * Success: The committed JSON value at path $.preferences.locale equals "fr-CA" in the User overrides editor
 * after Save is clicked for that editor. The correct labeled instance must satisfy the predicate.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Stack, Group, Box, Accordion, Divider } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const DEFAULT_INITIAL = {
  preferences: { locale: 'en-US', timezone: 'UTC' }
};

const OVERRIDES_INITIAL = {
  preferences: { locale: 'en-US', timezone: 'America/New_York' }
};

interface JsonEditorInstanceProps {
  label: string;
  initialJson: typeof DEFAULT_INITIAL;
  onCommit: (value: JsonValue) => void;
  testId: string;
}

function JsonEditorInstance({ label, initialJson, onCommit, testId }: JsonEditorInstanceProps) {
  const [jsonValue, setJsonValue] = useState(initialJson);

  const handleSave = () => {
    onCommit(jsonValue);
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

  return (
    <Box data-testid={testId}>
      <Text fw={500} size="sm" mb="xs">{label}</Text>
      <Box style={{ border: '1px solid #dee2e6', borderRadius: 4, padding: 8, background: '#f8f9fa' }} mb="sm">
        <Accordion defaultValue="preferences" variant="filled">
          <Accordion.Item value="preferences">
            <Accordion.Control>
              <Text size="sm" ff="monospace">preferences</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs" pl="md">
                <Group gap="xs">
                  <Text size="sm" ff="monospace" w={80}>locale:</Text>
                  <TextInput
                    size="xs"
                    value={jsonValue.preferences.locale}
                    onChange={(e) => updateJsonPath(['preferences', 'locale'], e.target.value)}
                    style={{ width: 120 }}
                    data-testid={`${testId}-locale`}
                  />
                </Group>
                <Group gap="xs">
                  <Text size="sm" ff="monospace" w={80}>timezone:</Text>
                  <TextInput
                    size="xs"
                    value={jsonValue.preferences.timezone}
                    onChange={(e) => updateJsonPath(['preferences', 'timezone'], e.target.value)}
                    style={{ width: 160 }}
                  />
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>
      <Button size="xs" onClick={handleSave}>Save</Button>
    </Box>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [, setDefaultCommitted] = useState<JsonValue>(DEFAULT_INITIAL);
  const [overridesCommitted, setOverridesCommitted] = useState<JsonValue>(OVERRIDES_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const locale = getJsonPath(overridesCommitted, '$.preferences.locale');
    if (locale === 'fr-CA') {
      successFired.current = true;
      onSuccess();
    }
  }, [overridesCommitted, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 480 }} data-testid="json-editor-card">
      <Text fw={600} size="lg" mb="md">User preferences</Text>

      <JsonEditorInstance
        label="Default preferences (JSON)"
        initialJson={DEFAULT_INITIAL}
        onCommit={setDefaultCommitted}
        testId="default-editor"
      />

      <Divider my="md" />

      <JsonEditorInstance
        label="User overrides (JSON)"
        initialJson={OVERRIDES_INITIAL}
        onCommit={setOverridesCommitted}
        testId="overrides-editor"
      />
    </Paper>
  );
}
