'use client';

/**
 * code_editor-antd-v2-T04: Worker tab insertion above run function
 *
 * Card with Ant Design card-style Tabs: "Overview", "API script", "Worker script". The Worker
 * tab has a Monaco editor and a "Save worker tab" button. Insert `const MAX_RETRIES = 3;`
 * directly above `async function run() {`.
 * Success: Worker content matches target, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Tabs, Button, Badge, Space } from 'antd';
import { SettingOutlined, CodeOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const WORKER_INITIAL = `async function run() {
  return true;
}`;

const WORKER_TARGET = `const MAX_RETRIES = 3;
async function run() {
  return true;
}`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [workerContent, setWorkerContent] = useState(WORKER_INITIAL);
  const [workerSaved, setWorkerSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!workerSaved) return;
    if (contentMatches(workerContent, WORKER_TARGET, {
      normalizeLineEndings: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [workerContent, workerSaved, onSuccess]);

  const handleSaveWorker = useCallback(() => {
    setWorkerSaved(true);
  }, []);

  return (
    <Card
      title={
        <Space>
          <span>Pipeline</span>
          <Badge count={3} size="small" />
          <SettingOutlined />
          <CodeOutlined />
        </Space>
      }
      style={{ width: 650 }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: 'overview',
            label: 'Overview',
            children: (
              <div style={{ padding: 16, color: '#888' }}>
                Pipeline overview. Select a script tab to edit.
              </div>
            ),
          },
          {
            key: 'api',
            label: 'API script',
            children: (
              <div style={{ padding: 16 }}>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                  <Editor
                    height="200px"
                    language="javascript"
                    value={'export async function handler(req) {\n  return { ok: true };\n}'}
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      fontSize: 13,
                      readOnly: true,
                    }}
                  />
                </div>
              </div>
            ),
          },
          {
            key: 'worker',
            label: 'Worker script',
            children: (
              <div style={{ padding: 16 }}>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 12 }}>
                  <Editor
                    height="250px"
                    language="javascript"
                    value={workerContent}
                    onChange={(v) => {
                      setWorkerContent(v || '');
                      setWorkerSaved(false);
                    }}
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      fontSize: 13,
                    }}
                  />
                </div>
                <Button type="primary" onClick={handleSaveWorker} data-testid="save-worker-tab">
                  Save worker tab
                </Button>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
