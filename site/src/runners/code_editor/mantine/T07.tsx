'use client';

/**
 * code_editor-mantine-T07: Match reference in Backend editor
 *
 * Dashboard layout with a header and two columns. Left column contains a read-only "Reference" panel
 * showing the target snippet.
 * Right column contains two Mantine code editor cards stacked:
 *   1) "Frontend" editor (JavaScript)
 *   2) "Backend" editor (Python)
 * Both editors are CodeMirror-based and have their own Apply button.
 * Initial state: both editors contain placeholder comments.
 * Only the Backend editor is the target; Apply commits that editor and shows "Saved" below it.
 *
 * Success: Backend editor content exactly matches the Reference snippet.
 * Backend Apply has been clicked (commit occurred).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Button, Group, Grid, Box, Badge } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const FRONTEND_PLACEHOLDER = '// Frontend placeholder';
const BACKEND_PLACEHOLDER = '# Backend placeholder';

const REFERENCE_CONTENT = `def handler(event):
    return {"ok": True}`;

export default function T07({ onSuccess }: TaskComponentProps) {
  const frontendEditorRef = useRef<HTMLDivElement>(null);
  const backendEditorRef = useRef<HTMLDivElement>(null);
  const frontendViewRef = useRef<EditorView | null>(null);
  const backendViewRef = useRef<EditorView | null>(null);
  
  const [backendContent, setBackendContent] = useState(BACKEND_PLACEHOLDER);
  const [backendSaved, setBackendSaved] = useState(false);
  const successFired = useRef(false);

  // Initialize Frontend CodeMirror
  useEffect(() => {
    if (!frontendEditorRef.current || frontendViewRef.current) return;

    const state = EditorState.create({
      doc: FRONTEND_PLACEHOLDER,
      extensions: [basicSetup, keymap.of([indentWithTab]), javascript()],
    });

    frontendViewRef.current = new EditorView({
      state,
      parent: frontendEditorRef.current,
    });

    return () => {
      frontendViewRef.current?.destroy();
      frontendViewRef.current = null;
    };
  }, []);

  // Initialize Backend CodeMirror
  useEffect(() => {
    if (!backendEditorRef.current || backendViewRef.current) return;

    const state = EditorState.create({
      doc: BACKEND_PLACEHOLDER,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        python(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setBackendContent(update.state.doc.toString());
            setBackendSaved(false);
          }
        }),
      ],
    });

    backendViewRef.current = new EditorView({
      state,
      parent: backendEditorRef.current,
    });

    return () => {
      backendViewRef.current?.destroy();
      backendViewRef.current = null;
    };
  }, []);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (backendSaved && contentMatches(backendContent, REFERENCE_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [backendContent, backendSaved, onSuccess]);

  const handleBackendApply = useCallback(() => {
    setBackendSaved(true);
  }, []);

  return (
    <Box style={{ width: 750 }}>
      <Text fw={700} size="xl" mb="md">Dashboard</Text>
      <Grid>
        {/* Left Column - Reference */}
        <Grid.Col span={4}>
          <Paper shadow="sm" p="md" withBorder data-testid="ref-mantine-07">
            <Text fw={600} size="sm" mb="sm">Reference</Text>
            <pre style={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: 12,
              background: '#f8f9fa',
              padding: 12,
              borderRadius: 4,
              whiteSpace: 'pre-wrap',
            }}>
              {REFERENCE_CONTENT}
            </pre>
          </Paper>
        </Grid.Col>

        {/* Right Column - Editors */}
        <Grid.Col span={8}>
          {/* Frontend Editor - Distractor */}
          <Paper shadow="sm" p="md" withBorder mb="md" data-testid="editor-frontend">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">Frontend</Text>
              <Button size="xs" variant="light">Apply</Button>
            </Group>
            <div 
              ref={frontendEditorRef}
              style={{ 
                border: '1px solid #dee2e6', 
                borderRadius: 4,
                minHeight: 100,
              }}
            />
          </Paper>

          {/* Backend Editor - Target */}
          <Paper shadow="sm" p="md" withBorder data-testid="editor-backend">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">Backend</Text>
              <Button size="xs" variant="light" onClick={handleBackendApply} data-testid="apply-backend">
                Apply
              </Button>
            </Group>
            <div 
              ref={backendEditorRef}
              style={{ 
                border: '1px solid #dee2e6', 
                borderRadius: 4,
                minHeight: 100,
              }}
            />
            {backendSaved && (
              <Badge color="green" size="sm" mt="sm">Saved</Badge>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
