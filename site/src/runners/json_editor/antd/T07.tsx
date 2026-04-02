'use client';

/**
 * json_editor-antd-T07: Fix invalid JSON and save from a modal
 *
 * Page shows an Ant Design Card titled "Advanced configuration". The card includes a button labeled "Edit raw JSON…".
 * Clicking "Edit raw JSON…" opens an Ant Design Modal titled "Edit raw configuration JSON".
 * Inside the modal is the JSON editor (starts in Code mode). The modal footer has "Apply" (primary) and "Cancel" buttons.
 * When the JSON text is invalid, the editor shows a red validation message (e.g., "Invalid JSON") and the Apply button is disabled.
 * Initial JSON text in the modal is intentionally invalid (contains a trailing comma):
 * {
 *   "mode": "safe",
 *   "threshold": 0.8,
 * }
 * There are no other steps after Apply; applying closes the modal and commits the JSON value.
 *
 * Success: The committed JSON document equals { "mode": "safe", "threshold": 0.8 } after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Input, Typography, Space } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const { Text } = Typography;

const INVALID_INITIAL_TEXT = `{
  "mode": "safe",
  "threshold": 0.8,
}`;

const TARGET_JSON = {
  mode: 'safe',
  threshold: 0.8
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeText, setCodeText] = useState(INVALID_INITIAL_TEXT);
  const [codeError, setCodeError] = useState<string | null>('Invalid JSON');
  const [committedValue, setCommittedValue] = useState<JsonValue | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedValue && jsonEquals(committedValue, TARGET_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpenModal = () => {
    setCodeText(INVALID_INITIAL_TEXT);
    setCodeError('Invalid JSON');
    setIsModalOpen(true);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(codeText);
      setCommittedValue(parsed);
      setIsModalOpen(false);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCodeText(text);
    try {
      JSON.parse(text);
      setCodeError(null);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  return (
    <>
      <Card title="Advanced configuration" style={{ width: 450 }} data-testid="json-editor-card">
        <Button type="default" onClick={handleOpenModal}>
          Edit raw JSON…
        </Button>
        {committedValue && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Committed JSON:</Text>
            <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, fontSize: 12 }}>
              {JSON.stringify(committedValue, null, 2)}
            </pre>
          </div>
        )}
      </Card>

      <Modal
        title="Edit raw configuration JSON"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleApply} disabled={!!codeError}>
              Apply
            </Button>
          </Space>
        }
        width={500}
      >
        <div>
          <Input.TextArea
            value={codeText}
            onChange={handleCodeChange}
            rows={8}
            style={{ fontFamily: 'monospace' }}
            status={codeError ? 'error' : undefined}
            data-testid="modal-code-editor"
          />
          {codeError && (
            <Text type="danger" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
              {codeError}
            </Text>
          )}
        </div>
      </Modal>
    </>
  );
}
