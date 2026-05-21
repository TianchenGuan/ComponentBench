'use client';

/**
 * json_editor-mantine-T04: Replace limits JSON in a modal (Code mode)
 *
 * Page shows a Mantine Card titled "Upload limits". It contains a button labeled "Edit limits (JSON)…".
 * Clicking the button opens a Mantine Modal titled "Limits (JSON)".
 * Inside the modal is the JSON editor with a mode control (Tree/Code). It starts in Code mode for this task.
 * The modal footer contains "Save" and "Cancel" buttons. Save is disabled if JSON is invalid.
 * Initial JSON in the modal:
 * {
 *   "limits": {"maxItems": 50, "maxSizeMb": 5},
 *   "enforce": true
 * }
 * You must replace it with the provided JSON (only the limits object; no extra keys like enforce).
 *
 * Success: The committed JSON document equals { "limits": { "maxItems": 100, "maxSizeMb": 10 } } after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, Modal, SegmentedControl, Group, Box, Stack, TextInput, Accordion } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const INITIAL_JSON = {
  limits: { maxItems: 50, maxSizeMb: 5 },
  enforce: true
};

const TARGET_JSON = {
  limits: { maxItems: 100, maxSizeMb: 10 }
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('code');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [committedValue, setCommittedValue] = useState<JsonValue | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedValue && jsonEquals(committedValue, TARGET_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpenModal = () => {
    setJsonValue(INITIAL_JSON);
    setCodeText(JSON.stringify(INITIAL_JSON, null, 2));
    setMode('code');
    setCodeError(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setCommittedValue(parsed);
        setModalOpen(false);
      } catch {
        setCodeError('Invalid JSON');
      }
    } else {
      setCommittedValue(jsonValue);
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
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
    <>
      <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 400 }} data-testid="json-editor-card">
        <Text fw={600} size="lg" mb="md">Upload limits</Text>
        <Button variant="default" onClick={handleOpenModal}>
          Edit limits (JSON)…
        </Button>
        {committedValue && (
          <Box mt="md">
            <Text size="sm" c="dimmed">Committed JSON:</Text>
            <pre style={{ fontSize: 11, background: '#f5f5f5', padding: 8, borderRadius: 4, margin: '4px 0 0' }}>
              {JSON.stringify(committedValue, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Limits (JSON)"
        size="md"
      >
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

        <Box mih={180} mb="md">
          {mode === 'tree' ? (
            <Stack gap="sm">
              <Accordion defaultValue="limits" variant="contained">
                <Accordion.Item value="limits">
                  <Accordion.Control>
                    <Text size="sm" ff="monospace">limits</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs" pl="md">
                      <Group gap="xs">
                        <Text size="sm" ff="monospace" w={90}>maxItems:</Text>
                        <TextInput
                          size="xs"
                          type="number"
                          value={obj.limits.maxItems}
                          onChange={(e) => updateJsonPath(['limits', 'maxItems'], Number(e.target.value))}
                          style={{ width: 100 }}
                        />
                      </Group>
                      <Group gap="xs">
                        <Text size="sm" ff="monospace" w={90}>maxSizeMb:</Text>
                        <TextInput
                          size="xs"
                          type="number"
                          value={obj.limits.maxSizeMb}
                          onChange={(e) => updateJsonPath(['limits', 'maxSizeMb'], Number(e.target.value))}
                          style={{ width: 100 }}
                        />
                      </Group>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
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
                rows={8}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  padding: 8,
                  border: codeError ? '1px solid red' : '1px solid #ced4da',
                  borderRadius: 4,
                }}
                data-testid="modal-code-editor"
              />
              {codeError && <Text size="xs" c="red">{codeError}</Text>}
            </Box>
          )}
        </Box>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={mode === 'code' && !!codeError}>Save</Button>
        </Group>
      </Modal>
    </>
  );
}
