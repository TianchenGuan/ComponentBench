'use client';

/**
 * code_editor-antd-T02: Reset to starter snippet
 *
 * Page shows a single Ant Design Card titled "Starter snippet" in the center.
 * The card contains a composite code editor built from AntD controls plus a CodeMirror 6 editor surface.
 * A small toolbar above the editor includes: Language dropdown, Reset button (label "Reset"),
 * and a non-interactive status text "Unsaved".
 * Initial state: the editor content has been modified and currently reads `export const broken = true` on a single line.
 * The desired default content is the built-in starter snippet (shown nowhere else), and pressing Reset immediately restores it.
 * There is only one editor instance; no dialogs, popovers, or other inputs are on the page.
 *
 * Success: The editor content equals the built-in starter snippet.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Select, Button, Space, Typography } from 'antd';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const { Text } = Typography;

const INITIAL_CONTENT = 'export const broken = true';
const DEFAULT_SNIPPET = `// Starter snippet
export function add(a, b) {
  return a + b;
}`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [language] = useState('javascript');
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
    <Card 
      title="Starter snippet" 
      style={{ width: 600 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Select
            value={language}
            disabled
            style={{ width: 140 }}
            options={[{ value: 'javascript', label: 'JavaScript' }]}
          />
          <Button onClick={handleReset} data-testid="editor-reset">
            Reset
          </Button>
        </Space>
        <Text type="secondary">Unsaved</Text>
      </Space>
      <div 
        ref={editorRef} 
        style={{ 
          border: '1px solid #d9d9d9', 
          borderRadius: 4,
          minHeight: 200,
        }}
        data-testid="codemirror-editor"
      />
    </Card>
  );
}
