'use client';

/**
 * json_editor-antd-v2-T03: Advanced config replace from reference and confirm
 *
 * Modal with Code-mode JSON editor + read-only Target JSON panel.
 * Replace JSON to match target, click Save → then click Confirm in second modal.
 * Initial: {"mode":"lenient","sampling":{"sampleRate":0.1},"tags":[]}
 * Target:  {"mode":"strict","sampling":{"sampleRate":0.5},"tags":["prod"]}
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Input, Typography, Space, Row, Col } from 'antd';
import type { TaskComponentProps, JsonValue } from '../../types';
import { jsonEquals } from '../../types';

const { Text } = Typography;

const INITIAL_JSON: JsonValue = {
  mode: 'lenient',
  sampling: { sampleRate: 0.1 },
  tags: [],
};

const TARGET_JSON: JsonValue = {
  mode: 'strict',
  sampling: { sampleRate: 0.5 },
  tags: ['prod'],
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pendingJson, setPendingJson] = useState<JsonValue | null>(null);
  const successFired = useRef(false);

  const handleOpenModal = () => {
    setCodeText(JSON.stringify(INITIAL_JSON, null, 2));
    setCodeError(null);
    setModalOpen(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeText(e.target.value);
    try {
      JSON.parse(e.target.value);
      setCodeError(null);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(codeText);
      setPendingJson(parsed);
      setConfirmOpen(true);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleConfirm = () => {
    if (successFired.current || !pendingJson) return;
    setConfirmOpen(false);
    setModalOpen(false);
    if (jsonEquals(pendingJson, TARGET_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Advanced config" style={{ width: 400 }}>
        <Text>Edit the advanced configuration JSON.</Text>
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={handleOpenModal}>Edit advanced config</Button>
        </div>
      </Card>

      <Modal
        title="Advanced config (JSON)"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={720}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave} disabled={!!codeError}>Save</Button>
          </Space>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Editor</Text>
            <Input.TextArea
              value={codeText}
              onChange={handleCodeChange}
              rows={10}
              style={{ fontFamily: 'monospace' }}
              status={codeError ? 'error' : undefined}
            />
            {codeError && <Text type="danger" style={{ fontSize: 12 }}>{codeError}</Text>}
          </Col>
          <Col span={12}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Target JSON</Text>
            <pre style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 6,
              fontFamily: 'monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
            }}>
              {JSON.stringify(TARGET_JSON, null, 2)}
            </pre>
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Confirm changes"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleConfirm}>Confirm</Button>
          </Space>
        }
      >
        <Text>Are you sure you want to apply these changes?</Text>
      </Modal>
    </div>
  );
}
