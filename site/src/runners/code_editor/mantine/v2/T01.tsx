'use client';

/**
 * code_editor-mantine-v2-T01: Top drawer deep-line constant edit
 *
 * Dark theme. "Edit worker script" opens a top-position Mantine Drawer with a CodeMirror editor.
 * The file is ~220 lines; line 180 has `const RETRIES = 1;`. Change to `const RETRIES = 3;`
 * and click "Save worker script".
 * Success: content contains `RETRIES = 3`, no `RETRIES = 1`, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Drawer, Group, Text } from '@mantine/core';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../../types';
import { normalizeContent } from '../../types';

function generateWorkerScript(): string {
  const lines: string[] = [];
  for (let i = 1; i <= 220; i++) {
    if (i === 180) {
      lines.push('const RETRIES = 1;');
    } else {
      lines.push(`// LINE ${String(i).padStart(3, '0')}`);
    }
  }
  return lines.join('\n');
}

const INITIAL_CONTENT = generateWorkerScript();

const darkTheme = EditorView.theme({
  '&': { backgroundColor: '#1e1e1e', color: '#d4d4d4' },
  '.cm-gutters': { backgroundColor: '#1e1e1e', color: '#858585', borderRight: '1px solid #3c3c3c' },
  '.cm-activeLineGutter': { backgroundColor: '#2a2a2a' },
  '.cm-activeLine': { backgroundColor: '#2a2a2a' },
  '.cm-cursor': { borderLeftColor: '#d4d4d4' },
}, { dark: true });

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const contentRef = useRef(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    if (!drawerOpen) return;
    const timer = setTimeout(() => {
      if (!editorRef.current || viewRef.current) return;
      const state = EditorState.create({
        doc: contentRef.current,
        extensions: [
          basicSetup,
          javascript(),
          darkTheme,
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const val = update.state.doc.toString();
              setContent(val);
              contentRef.current = val;
              setSaved(false);
            }
          }),
        ],
      });
      viewRef.current = new EditorView({ state, parent: editorRef.current });
    }, 100);
    return () => {
      clearTimeout(timer);
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const normalized = normalizeContent(content, { normalizeLineEndings: true });
    if (normalized.includes('const RETRIES = 3;') && !normalized.includes('const RETRIES = 1;')) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  return (
    <div style={{ padding: 24, backgroundColor: '#1e1e1e', minHeight: '100vh', color: '#d4d4d4' }}>
      <Button variant="filled" onClick={() => setDrawerOpen(true)}>
        Edit worker script
      </Button>
      <Text size="sm" c="dimmed" ml="sm" span>Worker script configuration</Text>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Worker script"
        position="top"
        size="70%"
        styles={{
          content: { backgroundColor: '#1e1e1e', color: '#d4d4d4' },
          header: { backgroundColor: '#1e1e1e', color: '#d4d4d4' },
        }}
      >
        <div
          ref={editorRef}
          style={{ border: '1px solid #3c3c3c', borderRadius: 4, minHeight: 300 }}
          data-testid="codemirror-editor"
        />
        <Group mt="md" justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setDrawerOpen(false)}>Cancel</Button>
          <Button variant="filled" onClick={handleSave} data-testid="save-worker-script">
            Save worker script
          </Button>
        </Group>
      </Drawer>
    </div>
  );
}
