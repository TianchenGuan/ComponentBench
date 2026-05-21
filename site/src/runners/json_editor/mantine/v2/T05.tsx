'use client';

/**
 * json_editor-mantine-v2-T05: Target JSON replace, save, and confirm in modal
 *
 * Mantine settings card with "Edit advanced config (JSON)…" button.
 * Opens modal with Code-mode editor on the left and read-only Target JSON on the right.
 * Replace editor content to match target, click Save → click Confirm in second modal.
 * Initial: {"mode":"lenient","sampling":{"sampleRate":0.1},"tags":[]}
 * Target:  {"mode":"strict","sampling":{"sampleRate":0.5},"tags":["prod"]}
 */

import React, { useState, useRef } from 'react';
import { Paper, Text, Button, Modal, Group, Box, Stack } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../../types';
import { jsonEquals } from '../../types';

const INITIAL_JSON: JsonValue = {
  mode: 'lenient',
  sampling: { sampleRate: 0.1 },
  tags: [],
};

const TARGET_JSON: JsonValue = {
  mode: 'strict',
  sampling: { sampleRate: 0.5 },
  tags: ['prod'],
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pendingJson, setPendingJson] = useState<JsonValue | null>(null);
  const successFired = useRef(false);

  const handleOpen = () => {
    setCodeText(JSON.stringify(INITIAL_JSON, null, 2));
    setCodeError(null);
    setModalOpen(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeText(e.target.value);
    try {
      JSON.parse(e.target.value);
      setCodeError(null);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(codeText);
      setPendingJson(parsed);
      setConfirmOpen(true);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleConfirm = () => {
    if (successFired.current || !pendingJson) return;
    setConfirmOpen(false);
    setModalOpen(false);
    if (jsonEquals(pendingJson, TARGET_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <Box p="lg">
      <Paper shadow="sm" p="lg" withBorder style={{ width: 420 }}>
        <Text fw={600} size="lg" mb="sm">Advanced config</Text>
        <Text size="sm" c="dimmed" mb="md">Manage the JSON-based advanced configuration.</Text>
        <Button onClick={handleOpen}>Edit advanced config (JSON)…</Button>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Advanced config (JSON)"
        size="xl"
      >
        <Group align="flex-start" gap="md" grow>
          <Stack gap="xs">
            <Text fw={600} size="sm">Editor</Text>
            <textarea
              value={codeText}
              onChange={handleCodeChange}
              rows={10}
              style={{
                width: '100%', fontFamily: 'monospace', fontSize: 13, padding: 8,
                border: codeError ? '1px solid red' : '1px solid #ced4da', borderRadius: 4,
              }}
            />
            {codeError && <Text size="xs" c="red">{codeError}</Text>}
          </Stack>
          <Stack gap="xs">
            <Text fw={600} size="sm">Target JSON</Text>
            <pre style={{
              background: '#f5f5f5', padding: 12, borderRadius: 6,
              fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap',
              margin: 0,
            }}>
              {JSON.stringify(TARGET_JSON, null, 2)}
            </pre>
          </Stack>
        </Group>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!!codeError}>Save</Button>
        </Group>
      </Modal>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm changes"
        size="sm"
      >
        <Text size="sm" mb="md">Are you sure you want to apply these changes?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Group>
      </Modal>
    </Box>
  );
}
