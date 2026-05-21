'use client';

/**
 * code_editor-antd-v2-T05: Find cacheBust line in long build script and apply
 *
 * Nested scroll layout: outer scrollable page with build settings cards, inner Monaco editor
 * card with a long build script (~100 lines). The `cacheBust` line is offscreen. An
 * "Apply build script" button commits the change.
 * Success: content contains `cacheBust = "hash"`, no `cacheBust = "off"`, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Statistic, Row, Col } from 'antd';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { normalizeContent } from '../../types';

const { Text } = Typography;

function generateBuildScript(): string {
  const lines: string[] = ['// Build Script Configuration', 'const config = {};', ''];
  for (let i = 1; i <= 100; i++) {
    if (i === 50) {
      lines.push('config.cacheBust = "off";');
    } else {
      lines.push(`config.setting${String(i).padStart(2, '0')} = ${i};`);
    }
  }
  lines.push('', 'module.exports = config;');
  return lines.join('\n');
}

const INITIAL_CONTENT = generateBuildScript();

export default function T05({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const normalized = normalizeContent(content, { normalizeLineEndings: true });
    if (normalized.includes('cacheBust = "hash"') && !normalized.includes('cacheBust = "off"')) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 16, height: '100vh', overflow: 'auto', padding: 16 }}>
      <div style={{ flex: 2, overflow: 'auto' }}>
        <Card title="Build script" size="small" style={{ marginBottom: 16 }} data-testid="editor-card">
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 12 }}>
            <Editor
              height="300px"
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
            />
          </div>
          <Button type="primary" onClick={handleApply} data-testid="apply-build-script">
            Apply build script
          </Button>
        </Card>
      </div>
      <div style={{ flex: 1 }}>
        <Card title="Build metrics" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}><Statistic title="Duration" value="2.3s" /></Col>
            <Col span={12}><Statistic title="Size" value="145KB" /></Col>
          </Row>
        </Card>
        <Card title="Deployments" size="small">
          <Text type="secondary">No recent deployments</Text>
        </Card>
      </div>
    </div>
  );
}
