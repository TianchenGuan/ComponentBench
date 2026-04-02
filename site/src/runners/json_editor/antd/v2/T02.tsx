'use client';

/**
 * json_editor-antd-v2-T02: Compact step reorder with Apply
 *
 * One JSON editor card "Pipeline steps (JSON)" in Tree mode with drag handles
 * on array items. Reorder `steps` to ["validate", "transform", "send"] and Apply.
 * Initial: ["validate", "send", "transform"].
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { HolderOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const { Text } = Typography;

const INITIAL_JSON = {
  steps: ['validate', 'send', 'transform'],
  enabled: true,
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [committed, setCommitted] = useState<JsonValue>(INITIAL_JSON);
  const successFired = useRef(false);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    const steps = getJsonPath(committed, '$.steps');
    if (Array.isArray(steps) && jsonEquals(steps as JsonValue[], ['validate', 'transform', 'send'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const obj = json as typeof INITIAL_JSON;

  const moveItem = useCallback((from: number, to: number) => {
    const steps = [...obj.steps];
    const [item] = steps.splice(from, 1);
    steps.splice(to, 0, item);
    setJson({ ...obj, steps });
  }, [obj, json]);

  return (
    <Card title="Pipeline steps (JSON)" style={{ width: 380 }} size="small">
      <div style={{ marginBottom: 8 }}>
        <Text code>enabled:</Text>{' '}
        <Text>{String(obj.enabled)}</Text>
      </div>
      <Text code style={{ display: 'block', marginBottom: 4 }}>steps:</Text>
      <div style={{ marginBottom: 12 }}>
        {obj.steps.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            draggable
            onDragStart={() => { dragIdx.current = idx; }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx.current !== null && dragIdx.current !== idx) {
                moveItem(dragIdx.current, idx);
              }
              dragIdx.current = null;
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 8px',
              marginBottom: 2,
              background: '#fafafa',
              border: '1px solid #f0f0f0',
              borderRadius: 4,
              cursor: 'grab',
            }}
          >
            <HolderOutlined style={{ color: '#999', cursor: 'grab' }} />
            <Text style={{ flex: 1 }}>{JSON.stringify(item)}</Text>
            <Space size={2}>
              <Button
                type="text"
                size="small"
                icon={<ArrowUpOutlined />}
                disabled={idx === 0}
                onClick={() => moveItem(idx, idx - 1)}
              />
              <Button
                type="text"
                size="small"
                icon={<ArrowDownOutlined />}
                disabled={idx === obj.steps.length - 1}
                onClick={() => moveItem(idx, idx + 1)}
              />
            </Space>
          </div>
        ))}
      </div>
      <Button type="primary" size="small" onClick={() => setCommitted(json)}>
        Apply
      </Button>
    </Card>
  );
}
