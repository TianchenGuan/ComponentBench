'use client';

/**
 * code_editor-antd-T04: Enter small JSON config
 *
 * Single Ant Design Card labeled "Config editor" is centered.
 * A composite CodeMirror 6 editor is shown with a small toolbar: a Language dropdown fixed to "JSON" (disabled),
 * and a Clear icon.
 * Initial state: the editor is empty and focused is not set.
 * CodeMirror shows line numbers and automatically indents when you press Enter, but no auto-format button is present.
 * There are no other components on the page.
 *
 * Success: The Config editor content matches the target JSON (line endings normalized; trailing whitespace ignored).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Select, Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../types';

const TARGET_CONTENT = `{
  "enabled": true,
  "retries": 3
}`;

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
        json(),
        indentUnit.of('  '),
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

  // Check for success — compare parsed JSON values to be format-agnostic
  useEffect(() => {
    if (successFired.current) return;
    try {
      const actual = JSON.parse(content);
      const expected = JSON.parse(TARGET_CONTENT);
      if (JSON.stringify(actual) === JSON.stringify(expected)) {
        successFired.current = true;
        onSuccess();
      }
    } catch {
      // Not valid JSON yet
    }
  }, [content, onSuccess]);

  const handleClear = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: '',
      },
    });
  }, []);

  return (
    <Card 
      title="Config editor" 
      style={{ width: 600 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12 }}>
        <Select
          value="json"
          disabled
          style={{ width: 140 }}
          options={[{ value: 'json', label: 'JSON' }]}
        />
        <Button icon={<DeleteOutlined />} onClick={handleClear} data-testid="editor-clear" />
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
