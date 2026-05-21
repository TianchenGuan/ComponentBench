'use client';

/**
 * code_editor-mantine-T01: Set title string
 *
 * Mantine Paper card centered titled "Title".
 * Composite code editor (CodeMirror 6) sits inside the card with a minimal Mantine toolbar (no language picker).
 * Initial state: editor contains a single line `export const title = "";`.
 * There are no other inputs or overlays.
 * Edits apply immediately; no Save/Apply button.
 *
 * Success: Editor content equals `export const title = "ComponentBench";` (optional trailing newline allowed).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Text } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = 'export const title = "";';
const TARGET_CONTENT = 'export const title = "ComponentBench";';

export default function T01({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: INITIAL_CONTENT,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
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
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">Title</Text>
      <div 
        ref={editorRef}
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: 4,
          minHeight: 150,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
