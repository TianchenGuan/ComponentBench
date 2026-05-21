'use client';

/**
 * code_editor-antd-v2-T06: Bottom drawer line-marker insertion with save
 *
 * "Edit release script" opens a bottom Ant Design Drawer with a Monaco editor showing 220
 * numbered comment lines (`// LINE 001` through `// LINE 220`). Insert `// marker` directly
 * above `// LINE 160`, then click "Save script".
 * Success: contains `// marker\n// LINE 160`, marker appears exactly once, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Drawer, Space, Typography } from 'antd';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { generateNumberedLines, normalizeContent, countOccurrences } from '../../types';

const { Text } = Typography;

const INITIAL_CONTENT = generateNumberedLines(220);

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const normalized = normalizeContent(content, { normalizeLineEndings: true });
    if (
      normalized.includes('// marker\n// LINE 160') &&
      countOccurrences(normalized, '// marker') === 1
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>
        Edit release script
      </Button>
      <Text type="secondary" style={{ marginLeft: 12 }}>Manage release script</Text>

      <Drawer
        title="Release script"
        placement="bottom"
        height={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave} data-testid="save-script">
              Save script
            </Button>
          </Space>
        }
      >
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
          <Editor
            height="380px"
            language="javascript"
            value={content}
            onChange={(v) => {
              setContent(v || '');
              setSaved(false);
            }}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              fontSize: 13,
            }}
            data-testid="script-editor"
          />
        </div>
      </Drawer>
    </div>
  );
}
