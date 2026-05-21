'use client';

/**
 * json_editor-antd-T08: Reorder pipeline steps array by dragging
 *
 * The JSON editor card is anchored near the top-right of the viewport.
 * UI uses Ant Design compact spacing (tighter padding and smaller gaps), but the editor remains fully visible.
 * A Card titled "Pipeline steps (JSON)" contains one JSON editor starting in Tree mode.
 * The JSON has an array field steps. In Tree mode, each array item row shows a drag handle icon (grip) used to reorder items.
 * Below the editor are "Apply" and "Reset" buttons.
 * Initial JSON value:
 * {
 *   "steps": ["validate", "send", "transform"],
 *   "enabled": true
 * }
 * Only the order of the array items matters for success.
 *
 * Success: The committed JSON value at path $.steps equals ["validate", "transform", "send"] after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Input, Switch, Typography, List } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, jsonEquals } from '../types';

const { Text } = Typography;

const INITIAL_JSON = {
  steps: ['validate', 'send', 'transform'],
  enabled: true
};

const TARGET_STEPS = ['validate', 'transform', 'send'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const steps = getJsonPath(committedValue, '$.steps');
    if (Array.isArray(steps) && jsonEquals(steps, TARGET_STEPS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(jsonValue, null, 2));
      setCodeError(null);
    }
  }, [jsonValue, mode]);

  const handleApply = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJsonValue(parsed);
        setCommittedValue(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      setCommittedValue(jsonValue);
    }
  };

  const handleReset = () => {
    setJsonValue(INITIAL_JSON);
    setCommittedValue(INITIAL_JSON);
    setCodeText(JSON.stringify(INITIAL_JSON, null, 2));
    setCodeError(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const obj = jsonValue as { steps: string[]; enabled: boolean };
    const newSteps = [...obj.steps];
    const [removed] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, removed);
    setJsonValue({ ...obj, steps: newSteps });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleEnabled = (checked: boolean) => {
    const obj = jsonValue as { steps: string[]; enabled: boolean };
    setJsonValue({ ...obj, enabled: checked });
  };

  const obj = jsonValue as { steps: string[]; enabled: boolean };

  return (
    <Card
      title="Pipeline steps (JSON)"
      style={{ width: 400 }}
      size="small"
      data-testid="json-editor-card"
    >
      <Tabs
        activeKey={mode}
        onChange={(key) => {
          if (key === 'code') {
            setCodeText(JSON.stringify(jsonValue, null, 2));
          } else {
            try {
              setJsonValue(JSON.parse(codeText));
            } catch {
              // Keep current
            }
          }
          setMode(key as 'tree' | 'code');
        }}
        items={[
          { key: 'tree', label: 'Tree' },
          { key: 'code', label: 'Code' },
        ]}
        size="small"
      />
      <div style={{ minHeight: 180, marginBottom: 12 }}>
        {mode === 'tree' ? (
          <div>
            <Text code style={{ display: 'block', marginBottom: 8 }}>steps:</Text>
            <List
              size="small"
              bordered
              dataSource={obj.steps}
              renderItem={(item, index) => (
                <List.Item
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    cursor: 'grab',
                    background: draggedIndex === index ? '#e6f7ff' : undefined,
                    padding: '4px 8px',
                  }}
                  data-testid={`step-item-${index}`}
                >
                  <Space>
                    <HolderOutlined style={{ cursor: 'grab', color: '#999' }} />
                    <Text code>{`"${item}"`}</Text>
                  </Space>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 12 }}>
              <Space>
                <Text code>enabled:</Text>
                <Switch
                  size="small"
                  checked={obj.enabled}
                  onChange={toggleEnabled}
                />
              </Space>
            </div>
          </div>
        ) : (
          <div>
            <Input.TextArea
              value={codeText}
              onChange={(e) => {
                setCodeText(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setCodeError(null);
                } catch {
                  setCodeError('Invalid JSON');
                }
              }}
              rows={6}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
              status={codeError ? 'error' : undefined}
            />
            {codeError && <Text type="danger" style={{ fontSize: 12 }}>{codeError}</Text>}
          </div>
        )}
      </div>
      <Space size="small">
        <Button type="primary" size="small" onClick={handleApply} disabled={mode === 'code' && !!codeError}>
          Apply
        </Button>
        <Button size="small" onClick={handleReset}>Reset</Button>
      </Space>
    </Card>
  );
}
