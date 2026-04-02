'use client';

/**
 * code_editor-mantine-v2-T05: Notification worker prepend import and change literal
 *
 * Dashboard panel with one Monaco editor labeled "Notification worker", a read-only Example panel,
 * and a "Save worker" button. The initial source is missing the import line and contains
 * `return "queued"`. Add the import and change "queued" to "sent" to match the Example.
 * Success: content matches the reference source, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Text, Button, Group, Code, Stack } from '@mantine/core';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const INITIAL_CONTENT = `export function worker() {
  return "queued";
}`;

const TARGET_CONTENT = `import { send } from "./mail";
export function worker() {
  return "sent";
}`;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    if (contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">Notification worker</Text>
      <div style={{ display: 'flex', gap: 16 }}>
        <Stack style={{ flex: 1 }}>
          <Text fw={500} size="sm">Editor</Text>
          <div style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
            <Editor
              height="200px"
              language="javascript"
              value={content}
              onChange={(v) => {
                setContent(v || '');
                setSaved(false);
              }}
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          </div>
          <Group>
            <Button variant="filled" onClick={handleSave} data-testid="save-worker">
              Save worker
            </Button>
          </Group>
        </Stack>

        <Stack style={{ flex: '0 0 250px' }}>
          <Text fw={500} size="sm">Example</Text>
          <Code block style={{ fontSize: 12 }}>
            {TARGET_CONTENT}
          </Code>
        </Stack>
      </div>
    </Card>
  );
}
