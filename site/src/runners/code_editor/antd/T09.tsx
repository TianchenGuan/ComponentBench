'use client';

/**
 * code_editor-antd-T09: Insert marker at line 160 (scroll)
 *
 * Single Ant Design Card is anchored near the bottom-right of the viewport (placement=bottom_right)
 * but remains fully visible without page scrolling.
 * The composite editor uses Monaco with line numbers enabled and a narrow scrollbar.
 * Initial state: the editor is preloaded with a long file consisting of numbered comment lines
 * from `// LINE 001` up to `// LINE 220` (one per line).
 * There is no separate search field outside the editor; the intended way to reach line 160
 * is by scrolling within the editor.
 * Toolbar has only non-essential controls (Copy, Format disabled); they are distractors.
 *
 * Success: The editor contains the exact two-line sequence `// marker` immediately followed by `// LINE 160`.
 * The marker line appears exactly once in the file.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space } from 'antd';
import { CopyOutlined, FormatPainterOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';
import { generateNumberedLines, contentContains, countOccurrences } from '../types';

const INITIAL_CONTENT = generateNumberedLines(220);
const TARGET_SUBSTRING = '// marker\n// LINE 160';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    
    const containsMarker = contentContains(content, TARGET_SUBSTRING);
    const markerCount = countOccurrences(content, '// marker');
    
    if (containsMarker && markerCount === 1) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Card 
      title="Script editor" 
      style={{ width: 550 }}
      data-testid="code-editor-card"
    >
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<CopyOutlined />} size="middle">Copy</Button>
        <Button icon={<FormatPainterOutlined />} size="middle" disabled>Format</Button>
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Editor
          height="350px"
          language="javascript"
          value={content}
          onChange={(value) => setContent(value || '')}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 13,
            scrollbar: {
              verticalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </Card>
  );
}
