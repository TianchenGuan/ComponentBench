'use client';

/**
 * code_editor-antd-T05: Replace TODO with DONE
 *
 * Ant Design isolated card in the center titled "Script editor".
 * A composite Monaco-based code editor fills the card: toolbar (buttons: Find, Replace, Apply)
 * and Monaco editor area with line numbers.
 * Initial state: the editor contains a short JavaScript snippet with the word "TODO" appearing twice
 * (once in the header comment and once inside the function).
 * Clicking the Replace button opens Monaco's inline find/replace widget inside the editor
 * (an overlay anchored to the top-right of the editor).
 * Apply is a primary AntD Button in the toolbar; it commits the current editor model into a "Saved" state
 * and shows a brief toast "Saved".
 * No other editors exist.
 *
 * Success: All occurrences of "TODO" in the Script editor content are replaced with "DONE".
 * Apply has been pressed so the editor is in the saved/committed state.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Space, message } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = `// TODO: replace me
function run() {
  // TODO: implement
  return 0;
}`;

const TARGET_CONTENT = `// DONE: replace me
function run() {
  // DONE: implement
  return 0;
}`;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  // Check for success - content must match AND be saved
  useEffect(() => {
    if (successFired.current) return;
    if (saved && contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleEditorMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    editorInstanceRef.current = editor;
  }, []);

  const handleFind = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('actions.find')?.run();
    }
  }, []);

  const handleReplace = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('editor.action.startFindReplaceAction')?.run();
    }
  }, []);

  const handleApply = useCallback(() => {
    setSaved(true);
    message.success('Saved');
  }, []);

  return (
    <Card 
      title="Script editor" 
      style={{ width: 650 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<SearchOutlined />} onClick={handleFind}>Find</Button>
        <Button icon={<SwapOutlined />} onClick={handleReplace}>Replace</Button>
        <Button type="primary" onClick={handleApply} data-testid="editor-apply">Apply</Button>
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Editor
          height="300px"
          language="javascript"
          value={content}
          onChange={(value) => {
            setContent(value || '');
            setSaved(false); // Mark as unsaved on change
          }}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
          }}
        />
      </div>
    </Card>
  );
}
