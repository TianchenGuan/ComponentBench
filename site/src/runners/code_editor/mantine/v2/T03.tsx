'use client';

/**
 * code_editor-mantine-v2-T03: Response status replacement in right drawer
 *
 * "Edit integrations" opens a Mantine Drawer from the right with two same-size Monaco editors:
 * "Request handler" (distractor) and "Response handler" (target). The Response editor contains
 * `status: 500` inside a handler function. Change it to `status: 503` and click "Apply handler".
 * Success: contains `status: 503`, no `status: 500`, Request unchanged, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Drawer, Group, Text, Stack, Card } from '@mantine/core';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../../types';
import { contentMatches, normalizeContent } from '../../types';

const REQUEST_CONTENT = `export function requestHandler(req) {
  return req;
}`;

const RESPONSE_INITIAL = `export function responseHandler(res) {
  if (res.error) {
    return { status: 500, message: res.error };
  }
  return res;
}`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requestContent, setRequestContent] = useState(REQUEST_CONTENT);
  const [responseContent, setResponseContent] = useState(RESPONSE_INITIAL);
  const [responseSaved, setResponseSaved] = useState(false);
  const responseEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!responseSaved) return;
    const normalized = normalizeContent(responseContent, { normalizeLineEndings: true });
    if (
      normalized.includes('status: 503') &&
      !normalized.includes('status: 500') &&
      contentMatches(requestContent, REQUEST_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [responseContent, requestContent, responseSaved, onSuccess]);

  const handleApply = useCallback(() => {
    setResponseSaved(true);
  }, []);

  const handleFind = useCallback(() => {
    responseEditorRef.current?.getAction('editor.action.startFindReplaceAction')?.run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Button variant="filled" onClick={() => setDrawerOpen(true)}>
        Edit integrations
      </Button>
      <Text size="sm" c="dimmed" ml="sm" span>Manage request and response handlers</Text>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Integrations"
        position="right"
        size="lg"
      >
        <Stack gap="md">
          <Card withBorder padding="sm" data-testid="editor-request-handler">
            <Text fw={500} size="sm" mb="xs">Request handler</Text>
            <div style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
              <Editor
                height="150px"
                language="javascript"
                value={requestContent}
                onChange={(v) => setRequestContent(v || '')}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </div>
          </Card>

          <Card withBorder padding="sm" data-testid="editor-response-handler">
            <Group mb="xs" justify="space-between">
              <Text fw={500} size="sm">Response handler</Text>
              <Button variant="light" size="xs" onClick={handleFind}>Find / Replace</Button>
            </Group>
            <div style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
              <Editor
                height="200px"
                language="javascript"
                value={responseContent}
                onChange={(v) => {
                  setResponseContent(v || '');
                  setResponseSaved(false);
                }}
                onMount={(ed) => { responseEditorRef.current = ed; }}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </div>
          </Card>

          <Group justify="flex-end">
            <Button variant="filled" onClick={handleApply} data-testid="apply-handler">
              Apply handler
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </div>
  );
}
