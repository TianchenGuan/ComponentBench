'use client';

/**
 * combobox_editable_multi-antd-v2-T02
 *
 * Modal flow: clicking "Edit labels" opens a modal with one tags-mode Select labeled "Labels".
 * Initial chips: backend. Suggestions: backend, urgent, p0, p1, docs.
 * Success: Labels = {backend, urgent, p0}, OK clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Modal, Select, Typography, Space, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text } = Typography;

const labelOptions = [
  { value: 'backend', label: 'backend' },
  { value: 'urgent', label: 'urgent' },
  { value: 'p0', label: 'p0' },
  { value: 'p1', label: 'p1' },
  { value: 'docs', label: 'docs' },
];

const TARGET_SET = ['backend', 'urgent', 'p0'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [labels, setLabels] = useState<string[]>(['backend']);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(labels, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, labels, onSuccess]);

  const handleOk = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ width: 420 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>Current labels:</Text>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {labels.map((l) => (
              <Tag key={l}>{l}</Tag>
            ))}
          </div>
          <Button onClick={() => setOpen(true)}>Edit labels</Button>
        </Space>
      </Card>

      <Modal
        title="Edit labels"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="OK"
        cancelText="Cancel"
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Labels</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add labels"
          value={labels}
          onChange={(v) => { setLabels(v); setSaved(false); }}
          options={labelOptions}
        />
      </Modal>
    </div>
  );
}
