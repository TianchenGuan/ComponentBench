'use client';

/**
 * code_editor-antd-v2-T01: Response editor replace widget in drawer
 *
 * "Edit API script" opens a right Ant Design Drawer with two stacked Monaco editors:
 * "Request transform" (distractor) and "Response transform" (target with TODO markers).
 * Success: replace all TODO→DONE in Response, click "Apply response", request unchanged.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Drawer, Space, Card, Typography } from 'antd';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const { Text } = Typography;

const REQUEST_CONTENT = `function requestTransform(req) {
  return req;
}`;

const RESPONSE_INITIAL = `// TODO: sanitize
function transform(res) {
  // TODO: map output
  return res;
}`;

const RESPONSE_TARGET = `// DONE: sanitize
function transform(res) {
  // DONE: map output
  return res;
}`;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requestContent, setRequestContent] = useState(REQUEST_CONTENT);
  const [responseContent, setResponseContent] = useState(RESPONSE_INITIAL);
  const [responseSaved, setResponseSaved] = useState(false);
  const responseEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!responseSaved) return;
    if (
      contentMatches(responseContent, RESPONSE_TARGET, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      }) &&
      contentMatches(requestContent, REQUEST_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [responseContent, requestContent, responseSaved, onSuccess]);

  const handleApplyResponse = useCallback(() => {
    setResponseSaved(true);
  }, []);

  const handleResponseReplace = useCallback(() => {
    responseEditorRef.current?.getAction('editor.action.startFindReplaceAction')?.run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>
        Edit API script
      </Button>
      <Text type="secondary" style={{ marginLeft: 12 }}>Configure request and response transforms</Text>

      <Drawer
        title="API script"
        placement="right"
        width={600}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card title="Request transform" size="small" data-testid="editor-request">
            <Space style={{ marginBottom: 8 }}>
              <Button size="small">Find</Button>
              <Button size="small">Replace</Button>
              <Button size="small" data-testid="apply-request-transform">Apply request</Button>
            </Space>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
              <Editor
                height="150px"
                language="javascript"
                value={requestContent}
                onChange={(v) => setRequestContent(v || '')}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </div>
          </Card>

          <Card title="Response transform" size="small" data-testid="editor-response">
            <Space style={{ marginBottom: 8 }}>
              <Button size="small">Find</Button>
              <Button size="small" onClick={handleResponseReplace}>Replace</Button>
              <Button
                size="small"
                type="primary"
                onClick={handleApplyResponse}
                data-testid="apply-response-transform"
              >
                Apply response
              </Button>
            </Space>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
              <Editor
                height="200px"
                language="javascript"
                value={responseContent}
                onChange={(v) => {
                  setResponseContent(v || '');
                  setResponseSaved(false);
                }}
                onMount={(ed) => { responseEditorRef.current = ed; }}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </div>
          </Card>
        </Space>
      </Drawer>
    </div>
  );
}
