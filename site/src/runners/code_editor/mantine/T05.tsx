'use client';

/**
 * code_editor-mantine-T05: Replace placeholder token
 *
 * Mantine Paper card centered titled "env.ts".
 * Composite Monaco editor with line numbers.
 * Toolbar includes a Replace button that opens an in-editor replace widget (overlay).
 * Initial content includes the token `PORT_PLACEHOLDER` exactly once.
 * There is no Save/Apply; edits are live.
 *
 * Success: Editor content equals the expected code with `PORT_PLACEHOLDER` replaced by `8080`.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Button, Group } from '@mantine/core';
import { IconReplace } from '@tabler/icons-react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = `export const PORT = PORT_PLACEHOLDER;
export const HOST = "localhost";`;

const TARGET_CONTENT = `export const PORT = 8080;
export const HOST = "localhost";`;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  const handleEditorMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
    editorInstanceRef.current = editorInstance;
  }, []);

  const handleReplace = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('editor.action.startFindReplaceAction')?.run();
    }
  }, []);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">env.ts</Text>
      <Group mb="sm">
        <Button 
          variant="light" 
          leftSection={<IconReplace size={16} />}
          onClick={handleReplace}
        >
          Replace
        </Button>
      </Group>
      <div style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
        <Editor
          height="180px"
          language="typescript"
          value={content}
          onChange={(value) => setContent(value || '')}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </div>
    </Paper>
  );
}
