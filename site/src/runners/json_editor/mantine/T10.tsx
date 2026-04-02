'use client';

/**
 * json_editor-mantine-T10: Replace advanced JSON, save, and confirm
 *
 * Page shows a Mantine settings card titled "Runtime config". A button labeled "Edit advanced config (JSON)…" opens a Mantine Modal.
 * The modal title is "Advanced config (JSON)". The modal contains:
 * - Left: JSON editor with Tree/Code mode selector (starts in Code mode).
 * - Right: a read-only panel titled "Target JSON" showing the same target snippet (visual reference).
 * Modal footer has a "Save" button and a "Cancel" button.
 * When Save is clicked, a confirmation dialog appears (Mantine confirm modal) with buttons "Confirm" and "Cancel".
 * The JSON is not committed until "Confirm" is clicked.
 * Initial JSON in the editor is:
 * {
 *   "mode": "lenient",
 *   "sampling": {"sampleRate": 0.1},
 *   "tags": []
 * }
 * You must replace it with the target JSON and complete the confirm step.
 *
 * Success: The committed JSON document equals the target after Confirm is clicked:
 * { "mode": "strict", "sampling": { "sampleRate": 0.5 }, "tags": ["prod"] }
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, Modal, SegmentedControl, Group, Box, Grid, Code, Stack } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const INITIAL_JSON = {
  mode: 'lenient',
  sampling: { sampleRate: 0.1 },
  tags: [] as string[]
};

const TARGET_JSON = {
  mode: 'strict',
  sampling: { sampleRate: 0.5 },
  tags: ['prod']
};

export default function T10({ onSuccess }: TaskComponentProps) {
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [mode, setMode] = useState<'tree' | 'code'>('code');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<JsonValue | null>(null);
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
    setCodeText(JSON.stringify(INITIAL_JSON, null, 2));
    setMode('code');
    setCodeError(null);
    setMainModalOpen(true);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(codeText);
      setPendingValue(parsed);
      setMainModalOpen(false);
      setConfirmModalOpen(true);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleConfirm = () => {
    if (pendingValue) {
      setCommittedValue(pendingValue);
    }
    setConfirmModalOpen(false);
    setPendingValue(null);
  };

  const handleCancelConfirm = () => {
    setConfirmModalOpen(false);
    setPendingValue(null);
    setMainModalOpen(true); // Re-open main modal
  };

  return (
    <>
      <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 400 }} data-testid="json-editor-card">
        <Text fw={600} size="lg" mb="md">Runtime config</Text>
        <Text size="sm" c="dimmed" mb="md">
          Configure runtime settings for the application.
        </Text>
        <Button variant="default" onClick={handleOpenModal}>
          Edit advanced config (JSON)…
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

      {/* Main editor modal */}
      <Modal
        opened={mainModalOpen}
        onClose={() => setMainModalOpen(false)}
        title="Advanced config (JSON)"
        size="lg"
      >
        <Grid gutter="md">
          <Grid.Col span={7}>
            <SegmentedControl
              value={mode}
              onChange={(val) => setMode(val as 'tree' | 'code')}
              data={[
                { label: 'Tree', value: 'tree' },
                { label: 'Code', value: 'code' },
              ]}
              size="xs"
              mb="sm"
            />

            <Box mih={200} mb="md">
              {mode === 'code' ? (
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
                    rows={10}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      padding: 8,
                      border: codeError ? '1px solid red' : '1px solid #ced4da',
                      borderRadius: 4,
                    }}
                    data-testid="modal-code-editor"
                  />
                  {codeError && <Text size="xs" c="red">{codeError}</Text>}
                </Box>
              ) : (
                <Text size="sm" c="dimmed">Switch to Code mode to edit</Text>
              )}
            </Box>
          </Grid.Col>

          <Grid.Col span={5}>
            <Box style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, height: '100%', border: '1px solid #e0e0e0' }}>
              <Text fw={500} size="sm" mb="xs">Target JSON</Text>
              <Code block style={{ fontSize: 11, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(TARGET_JSON, null, 2)}
              </Code>
            </Box>
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button variant="default" onClick={() => setMainModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!!codeError}>Save</Button>
        </Group>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        opened={confirmModalOpen}
        onClose={handleCancelConfirm}
        title="Confirm changes"
        size="sm"
      >
        <Stack>
          <Text size="sm">Are you sure you want to apply these changes?</Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={handleCancelConfirm}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
