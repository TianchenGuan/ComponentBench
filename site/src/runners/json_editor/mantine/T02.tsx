'use client';

/**
 * json_editor-mantine-T02: Enable cache.enabled flag
 *
 * Page shows a centered Mantine Card titled "Cache settings (JSON)".
 * The JSON editor starts in Tree mode. Boolean values can be edited via an inline true/false control.
 * A Save button is shown under the editor.
 * Initial JSON value:
 * {
 *   "cache": {"enabled": false, "ttlSeconds": 60},
 *   "strategy": "memory"
 * }
 *
 * Success: The committed JSON value at path $.cache.enabled equals true after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Switch, SegmentedControl, Stack, Group, Box, Accordion } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  cache: { enabled: false, ttlSeconds: 60 },
  strategy: 'memory'
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const enabled = getJsonPath(committedValue, '$.cache.enabled');
    if (enabled === true) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(jsonValue, null, 2));
      setCodeError(null);
    }
  }, [jsonValue, mode]);

  const handleSave = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJsonValue(parsed);
        setCommittedValue(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      setCommittedValue(jsonValue);
    }
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
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 480 }} data-testid="json-editor-card">
      <Text fw={600} size="lg" mb="md">Cache settings (JSON)</Text>

      <SegmentedControl
        value={mode}
        onChange={(val) => {
          if (val === 'code') {
            setCodeText(JSON.stringify(jsonValue, null, 2));
          } else {
            try {
              setJsonValue(JSON.parse(codeText));
            } catch {
              // Keep current
            }
          }
          setMode(val as 'tree' | 'code');
        }}
        data={[
          { label: 'Tree', value: 'tree' },
          { label: 'Code', value: 'code' },
        ]}
        size="xs"
        mb="md"
      />

      <Box mih={150} mb="md">
        {mode === 'tree' ? (
          <Stack gap="sm">
            <Accordion defaultValue="cache" variant="contained">
              <Accordion.Item value="cache">
                <Accordion.Control>
                  <Text size="sm" ff="monospace">cache</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs" pl="md">
                    <Group gap="xs">
                      <Text size="sm" ff="monospace" w={90}>enabled:</Text>
                      <Switch
                        size="sm"
                        checked={obj.cache.enabled}
                        onChange={(e) => updateJsonPath(['cache', 'enabled'], e.currentTarget.checked)}
                      />
                    </Group>
                    <Group gap="xs">
                      <Text size="sm" ff="monospace" w={90}>ttlSeconds:</Text>
                      <TextInput
                        size="xs"
                        type="number"
                        value={obj.cache.ttlSeconds}
                        onChange={(e) => updateJsonPath(['cache', 'ttlSeconds'], Number(e.target.value))}
                        style={{ width: 100 }}
                      />
                    </Group>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Group gap="xs">
              <Text size="sm" ff="monospace" w={90}>strategy:</Text>
              <TextInput
                size="xs"
                value={obj.strategy}
                onChange={(e) => updateJsonPath(['strategy'], e.target.value)}
                style={{ width: 150 }}
              />
            </Group>
          </Stack>
        ) : (
          <Box>
            <textarea
              value={codeText}
              onChange={(e) => {
                setCodeText(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setCodeError(null);
                } catch {
                  setCodeError('Invalid JSON');
                }
              }}
              rows={7}
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: 13,
                padding: 8,
                border: codeError ? '1px solid red' : '1px solid #ced4da',
                borderRadius: 4,
              }}
            />
            {codeError && <Text size="xs" c="red">{codeError}</Text>}
          </Box>
        )}
      </Box>

      <Button onClick={handleSave} disabled={mode === 'code' && !!codeError}>
        Save
      </Button>
    </Paper>
  );
}
