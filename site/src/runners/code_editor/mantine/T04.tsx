'use client';

/**
 * code_editor-mantine-T04: Enter TOML config
 *
 * Mantine Paper card centered titled "server.toml".
 * Composite CodeMirror editor configured for TOML-like plain text (monospace) with line numbers.
 * Initial state: editor is empty.
 * A small helper text below the editor says "No extra blank lines".
 * No Save/Apply; content updates live.
 *
 * Success: Editor content equals the target TOML (line endings normalized; trailing whitespace ignored).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Text } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const TARGET_CONTENT = `[server]
port = 8080
host = "127.0.0.1"`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState('');
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
          }
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">server.toml</Text>
      <div 
        ref={editorRef}
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: 4,
          minHeight: 180,
        }}
        data-testid="codemirror-editor"
      />
      <Text size="xs" c="dimmed" mt="sm">No extra blank lines</Text>
    </Paper>
  );
}
