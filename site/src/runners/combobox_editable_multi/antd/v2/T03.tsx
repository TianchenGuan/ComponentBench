'use client';

/**
 * combobox_editable_multi-antd-v2-T03
 *
 * Drawer flow: "Edit release labels" opens a drawer with one tags-mode Select labeled "Release labels".
 * maxCount=4. Initial chips: alpha, beta, gamma, delta (full). maxTagCount="responsive".
 * Suggestions: alpha, beta, gamma, delta, omega, theta, lambda.
 * Success: Release labels = {alpha, gamma, omega, theta}, Save labels clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Drawer, Select, Typography, Space, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text } = Typography;

const labelOptions = [
  { value: 'alpha', label: 'alpha' },
  { value: 'beta', label: 'beta' },
  { value: 'gamma', label: 'gamma' },
  { value: 'delta', label: 'delta' },
  { value: 'omega', label: 'omega' },
  { value: 'theta', label: 'theta' },
  { value: 'lambda', label: 'lambda' },
];

const TARGET_SET = ['alpha', 'gamma', 'omega', 'theta'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [labels, setLabels] = useState<string[]>(['alpha', 'beta', 'gamma', 'delta']);
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

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ width: 420 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>Current release labels:</Text>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {labels.map((l) => (
              <Tag key={l} color="blue">{l}</Tag>
            ))}
          </div>
          <Button onClick={() => setOpen(true)}>Edit release labels</Button>
        </Space>
      </Card>

      <Drawer
        title="Edit release labels"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={380}
        extra={
          <Button type="primary" size="small" onClick={handleSave}>
            Save labels
          </Button>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Release labels</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add release labels"
          value={labels}
          onChange={(v) => { setLabels(v); setSaved(false); }}
          options={labelOptions}
          maxCount={4}
          maxTagCount="responsive"
        />
      </Drawer>
    </div>
  );
}
