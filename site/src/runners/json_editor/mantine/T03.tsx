'use client';

/**
 * json_editor-mantine-T03: Revert JSON to last saved state
 *
 * Page shows a centered Mantine Card titled "View options (JSON)".
 * A single JSON editor is shown in Tree mode.
 * Below the editor are two controls: a primary "Save" button and a secondary "Revert" button.
 * The editor loads with unsaved changes already present (an inline "Unsaved changes" indicator is visible).
 * Current (dirty) JSON shown at load:
 * {
 *   "layout": "list",
 *   "pageSize": 50,
 *   "showHints": false
 * }
 * Clicking Revert immediately restores the last saved JSON (no confirmation).
 * The last saved JSON should be:
 * {
 *   "layout": "grid",
 *   "pageSize": 25,
 *   "showHints": true
 * }
 *
 * Success: The committed JSON document equals the saved/reverted JSON (no explicit confirmation, live state).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Switch, SegmentedControl, Stack, Group, Box, Badge } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const DIRTY_JSON = {
  layout: 'list',
  pageSize: 50,
  showHints: false
};

const SAVED_JSON = {
  layout: 'grid',
  pageSize: 25,
  showHints: true
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(DIRTY_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(DIRTY_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(true);
  const successFired = useRef(false);

  // Live state check - success when JSON matches saved
  useEffect(() => {
    if (successFired.current) return;
    if (jsonEquals(jsonValue, SAVED_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  }, [jsonValue, onSuccess]);

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
        setIsModified(false);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
      }
    } else {
      setIsModified(false);
    }
  };

  const handleRevert = () => {
    setJsonValue(SAVED_JSON);
    setCodeText(JSON.stringify(SAVED_JSON, null, 2));
    setCodeError(null);
    setIsModified(false);
  };

  const updateField = (field: string, value: JsonValue) => {
    setJsonValue({ ...(jsonValue as object), [field]: value });
    setIsModified(true);
  };

  const obj = jsonValue as typeof DIRTY_JSON;

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 450 }} data-testid="json-editor-card">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">View options (JSON)</Text>
        {isModified && <Badge color="orange" variant="light">Unsaved changes</Badge>}
      </Group>

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

      <Box mih={130} mb="md">
        {mode === 'tree' ? (
          <Stack gap="sm">
            <Group gap="xs">
              <Text size="sm" ff="monospace" w={90}>layout:</Text>
              <TextInput
                size="xs"
                value={obj.layout}
                onChange={(e) => updateField('layout', e.target.value)}
                style={{ width: 120 }}
              />
            </Group>
            <Group gap="xs">
              <Text size="sm" ff="monospace" w={90}>pageSize:</Text>
              <TextInput
                size="xs"
                type="number"
                value={obj.pageSize}
                onChange={(e) => updateField('pageSize', Number(e.target.value))}
                style={{ width: 100 }}
              />
            </Group>
            <Group gap="xs">
              <Text size="sm" ff="monospace" w={90}>showHints:</Text>
              <Switch
                size="sm"
                checked={obj.showHints}
                onChange={(e) => updateField('showHints', e.currentTarget.checked)}
              />
            </Group>
          </Stack>
        ) : (
          <Box>
            <textarea
              value={codeText}
              onChange={(e) => {
                setCodeText(e.target.value);
                setIsModified(true);
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

      <Group gap="sm">
        <Button onClick={handleSave} disabled={mode === 'code' && !!codeError}>
          Save
        </Button>
        <Button variant="default" onClick={handleRevert}>
          Revert
        </Button>
      </Group>
    </Paper>
  );
}
