'use client';

/**
 * code_editor-antd-T07: Apply with confirmation
 *
 * Ant Design Card (center) titled "Apply with confirmation".
 * Composite Monaco editor with toolbar actions: Apply (primary), and a small status chip "Not saved".
 * Initial state: the editor contains exactly `let count = 0;` on one line.
 * When you click Apply, an AntD Popconfirm appears anchored to the Apply button with the message
 * "Apply changes?" and two buttons: "Confirm" and "Cancel".
 * Only after clicking Confirm does the editor become saved; a toast "Saved" appears briefly.
 * There is only one editor instance and no other page clutter.
 *
 * Success: The Script editor content equals `let count = 1;` (optional trailing newline allowed).
 * The Apply confirmation has been confirmed (saved/committed state is true).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Space, Typography, Popconfirm, message, Tag } from 'antd';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const { Text } = Typography;

const INITIAL_CONTENT = 'let count = 0;';
const TARGET_CONTENT = 'let count = 1;';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
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

  const handleConfirm = useCallback(() => {
    setSaved(true);
    message.success('Saved');
  }, []);

  return (
    <Card 
      title="Apply with confirmation" 
      style={{ width: 600 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
        <Popconfirm
          title="Apply changes?"
          onConfirm={handleConfirm}
          okText="Confirm"
          cancelText="Cancel"
        >
          <Button type="primary" data-testid="editor-apply">Apply</Button>
        </Popconfirm>
        <Tag color={saved ? 'green' : 'default'}>{saved ? 'Saved' : 'Not saved'}</Tag>
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Editor
          height="200px"
          language="javascript"
          value={content}
          onChange={(value) => {
            setContent(value || '');
            setSaved(false); // Mark as unsaved on change
          }}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </div>
    </Card>
  );
}
