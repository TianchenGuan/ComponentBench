'use client';

/**
 * json_editor-mantine-T01: Edit serviceName string and save
 *
 * Page shows a centered Mantine Card titled "Service metadata (JSON)".
 * A single embedded JSON editor starts in Tree mode. Mantine styling is used for surrounding controls.
 * String values are edited inline (click the value to edit).
 * A "Save" button below the editor commits the JSON.
 * Initial JSON value:
 * {
 *   "serviceName": "Orders",
 *   "owner": "platform"
 * }
 *
 * Success: The committed JSON value at path $.serviceName equals "Orders API" after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, SegmentedControl, Stack, Group, Box } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  serviceName: 'Orders',
  owner: 'platform'
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const serviceName = getJsonPath(committedValue, '$.serviceName');
    if (serviceName === 'Orders API') {
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

  const updateField = (field: string, value: JsonValue) => {
    setJsonValue({ ...(jsonValue as object), [field]: value });
  };

  const obj = jsonValue as typeof INITIAL_JSON;

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 450 }} data-testid="json-editor-card">
      <Text fw={600} size="lg" mb="md">Service metadata (JSON)</Text>

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

      <Box mih={120} mb="md">
        {mode === 'tree' ? (
          <Stack gap="sm">
            <Group gap="xs">
              <Text size="sm" ff="monospace" w={100}>serviceName:</Text>
              <TextInput
                size="xs"
                value={obj.serviceName}
                onChange={(e) => updateField('serviceName', e.target.value)}
                style={{ width: 180 }}
                data-testid="input-serviceName"
              />
            </Group>
            <Group gap="xs">
              <Text size="sm" ff="monospace" w={100}>owner:</Text>
              <TextInput
                size="xs"
                value={obj.owner}
                onChange={(e) => updateField('owner', e.target.value)}
                style={{ width: 180 }}
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
              rows={6}
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
