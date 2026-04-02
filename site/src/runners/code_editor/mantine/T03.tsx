'use client';

/**
 * code_editor-mantine-T03: Reset to default snippet
 *
 * Mantine Paper card centered titled "Defaults".
 * Composite CodeMirror 6 editor with a small toolbar including a Reset button.
 * Initial state: the editor currently shows `const enabled = false;` (it has been modified).
 * Clicking Reset immediately restores the built-in default snippet:
 * // Default snippet
 * const enabled = true;
 * There is only one editor instance and no other controls.
 *
 * Success: Editor content equals the default snippet (line endings normalized; trailing whitespace ignored).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Button, Group } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = 'const enabled = false;';
const DEFAULT_SNIPPET = `// Default snippet
const enabled = true;`;

export default function T03({ onSuccess }: TaskComponentProps) {
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
    if (contentMatches(content, DEFAULT_SNIPPET, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  const handleReset = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: DEFAULT_SNIPPET,
      },
    });
  }, []);

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 550 }} data-testid="code-editor-card">
      <Text fw={600} size="lg" mb="md">Defaults</Text>
      <Group mb="sm">
        <Button variant="light" onClick={handleReset} data-testid="editor-reset">
          Reset
        </Button>
      </Group>
      <div 
        ref={editorRef}
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: 4,
          minHeight: 180,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
