'use client';

/**
 * code_editor-antd-T06: Enable word wrap (dark theme)
 *
 * Ant Design Card is centered; the whole page uses a dark theme (dark background with light text),
 * but spacing remains comfortable.
 * The composite editor uses CodeMirror 6. A toolbar includes a labeled toggle switch "Word wrap" (off by default)
 * and a read-only indicator "JS".
 * Initial state: the editor contains one very long single line that extends beyond the visible width,
 * producing a horizontal scrollbar when wrap is off.
 * Toggling Word wrap immediately changes the editor option so long lines wrap within the viewport.
 * There is one editor instance and no confirmation dialogs.
 *
 * Success: Editor option `word_wrap` is enabled (true). Editor content is otherwise unchanged.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Switch, Space, Typography, ConfigProvider, theme } from 'antd';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const LONG_LINE = 'const longVariableName = "This is a very long string that extends well beyond the visible width of the editor and should cause horizontal scrolling when word wrap is disabled but should wrap nicely when word wrap is enabled for better readability in the code editor interface";';

export default function T06({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [wordWrap, setWordWrap] = useState(false);
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current) return;

    // Destroy previous instance if exists
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      javascript(),
      EditorView.theme({
        '&': { backgroundColor: '#1f1f1f' },
        '.cm-content': { color: '#d4d4d4' },
        '.cm-gutters': { backgroundColor: '#1f1f1f', color: '#858585', border: 'none' },
        '.cm-activeLineGutter': { backgroundColor: '#2a2a2a' },
        '.cm-activeLine': { backgroundColor: '#2a2a2a' },
      }),
    ];

    if (wordWrap) {
      extensions.push(EditorView.lineWrapping);
    }

    const state = EditorState.create({
      doc: LONG_LINE,
      extensions,
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [wordWrap]);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (wordWrap) {
      successFired.current = true;
      onSuccess();
    }
  }, [wordWrap, onSuccess]);

  const handleWordWrapChange = useCallback((checked: boolean) => {
    setWordWrap(checked);
  }, []);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card 
        title="Code Editor" 
        style={{ width: 600, backgroundColor: '#1f1f1f' }}
        styles={{ header: { color: '#fff' }, body: { padding: 16 } }}
        data-testid="code-editor-card"
      >
        <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Text style={{ color: '#d4d4d4' }}>Word wrap</Text>
            <Switch 
              checked={wordWrap} 
              onChange={handleWordWrapChange}
              data-testid="word-wrap-switch"
            />
          </Space>
          <Text type="secondary">JS</Text>
        </Space>
        <div 
          ref={editorRef} 
          style={{ 
            border: '1px solid #424242', 
            borderRadius: 4,
            minHeight: 200,
          }}
          data-testid="codemirror-editor"
        />
      </Card>
    </ConfigProvider>
  );
}
