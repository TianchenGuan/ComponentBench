'use client';

/**
 * code_editor-antd-T03: Switch language to JSON
 *
 * Centered Ant Design Card titled "Language" contains one composite code editor.
 * The toolbar row includes a labeled dropdown "Language" with options: JavaScript, JSON, Python, YAML.
 * Below the toolbar is a Monaco Editor with line numbers and a small scrollbar.
 * Initial state: Language is set to JavaScript. The editor already contains a small JSON-looking snippet:
 * {"status": "ok"} formatted on three lines.
 * Changing Language does not modify the text; it only changes the editor mode (syntax highlighting / language id).
 *
 * Success: The editor language/mode is set to JSON. Editor text may remain unchanged; only the language state is checked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Space, Typography } from 'antd';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const INITIAL_CONTENT = `{
  "status": "ok"
}`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [language, setLanguage] = useState('javascript');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (language === 'json') {
      successFired.current = true;
      onSuccess();
    }
  }, [language, onSuccess]);

  return (
    <Card 
      title="Language" 
      style={{ width: 600 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12 }}>
        <Text>Language</Text>
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
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Editor
          height="250px"
          language={language}
          value={content}
          onChange={(value) => setContent(value || '')}
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
