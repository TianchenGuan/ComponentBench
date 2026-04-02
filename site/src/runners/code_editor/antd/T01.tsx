'use client';

/**
 * code_editor-antd-T01: Quick log line
 *
 * Page shows a single Ant Design Card centered in the viewport titled "Script editor".
 * Inside the card is a composite code editor: an AntD toolbar row (Language dropdown + a few icon buttons)
 * and a Monaco Editor text surface below.
 * Spacing is comfortable with default-sized controls. The editor is large enough to show ~12 lines
 * and includes a left gutter with line numbers.
 * Initial state: the editor content is empty (no text). Language is set to JavaScript. Word wrap is off.
 * There are no other form fields, menus, or dialogs on the page, and there is only one editor instance.
 *
 * Success: The Script editor's content equals `console.log('hello');` (allowing an optional trailing newline).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Button, Space } from 'antd';
import { CopyOutlined, FormatPainterOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const TARGET_CONTENT = "console.log('hello');";

export default function T01({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (contentMatches(content, TARGET_CONTENT, { 
      normalizeLineEndings: true, 
      allowTrailingNewline: true,
      ignoreTrailingWhitespace: false 
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Card 
      title="Script editor" 
      style={{ width: 600 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12 }}>
        <Select
          value={language}
          onChange={setLanguage}
          style={{ width: 140 }}
          options={[
            { value: 'javascript', label: 'JavaScript' },
            { value: 'json', label: 'JSON' },
            { value: 'python', label: 'Python' },
            { value: 'yaml', label: 'YAML' },
          ]}
          data-testid="language-select"
        />
        <Button icon={<CopyOutlined />} size="middle" />
        <Button icon={<FormatPainterOutlined />} size="middle" />
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Editor
          height="300px"
          language={language}
          value={content}
          onChange={(value) => setContent(value || '')}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'off',
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
          data-testid="monaco-editor"
        />
      </div>
    </Card>
  );
}
