'use client';

/**
 * code_editor-mantine-v2-T02: Request/response sanitizer pair with exact response commit
 *
 * Dashboard card with two Monaco editors side by side: "Request sanitizer" (distractor) and
 * "Response sanitizer" (target). A read-only Example panel shows the desired Response code with
 * a guard clause. The Response editor is missing the guard clause.
 * Success: Response matches Example, Request unchanged, "Commit response sanitizer" clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Text, Button, Group, Stack, Code } from '@mantine/core';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const REQUEST_CONTENT = `export function sanitize(req) {
  return req;
}`;

const RESPONSE_INITIAL = `export function sanitize(res) {
  return res;
}`;

const RESPONSE_TARGET = `export function sanitize(res) {
  if (!res) return null;
  return res;
}`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [requestContent, setRequestContent] = useState(REQUEST_CONTENT);
  const [responseContent, setResponseContent] = useState(RESPONSE_INITIAL);
  const [responseSaved, setResponseSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!responseSaved) return;
    if (
      contentMatches(responseContent, RESPONSE_TARGET, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      }) &&
      contentMatches(requestContent, REQUEST_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [responseContent, requestContent, responseSaved, onSuccess]);

  const handleCommitResponse = useCallback(() => {
    setResponseSaved(true);
  }, []);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: 850 }}>
      <Text fw={600} size="lg" mb="md">Sanitizers</Text>
      <div style={{ display: 'flex', gap: 16 }}>
        <Stack style={{ flex: 1 }} data-testid="editor-request-sanitizer">
          <Text fw={500} size="sm">Request sanitizer</Text>
          <div style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
            <Editor
              height="180px"
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
        </Stack>

        <Stack style={{ flex: 1 }} data-testid="editor-response-sanitizer">
          <Text fw={500} size="sm">Response sanitizer</Text>
          <div style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
            <Editor
              height="180px"
              language="javascript"
              value={responseContent}
              onChange={(v) => {
                setResponseContent(v || '');
                setResponseSaved(false);
              }}
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 13,
              }}
            />
          </div>
          <Button variant="filled" onClick={handleCommitResponse} data-testid="commit-response-sanitizer">
            Commit response sanitizer
          </Button>
        </Stack>

        <Stack style={{ flex: '0 0 220px' }}>
          <Text fw={500} size="sm">Example</Text>
          <Code block style={{ fontSize: 12 }}>
            {RESPONSE_TARGET}
          </Code>
        </Stack>
      </div>
    </Card>
  );
}
