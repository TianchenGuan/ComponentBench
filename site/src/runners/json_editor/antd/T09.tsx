'use client';

/**
 * json_editor-antd-T09: Match the Target JSON shown in the reference panel
 *
 * Page shows a centered Ant Design Card titled "Logging configuration".
 * The card is split into two columns:
 * - Left: an editable JSON editor (Tree/Code tabs, starts in Tree mode).
 * - Right: a read-only panel titled "Target JSON" showing the desired final JSON as formatted text.
 * Below the editable editor are "Apply" and "Reset" buttons.
 * Initial editable JSON:
 * {
 *   "enabled": false,
 *   "level": "debug",
 *   "tags": ["api"]
 * }
 * Target JSON shown in the right panel (reference) is:
 * {
 *   "enabled": true,
 *   "level": "info",
 *   "tags": ["billing", "api"]
 * }
 *
 * Success: The committed JSON document equals the target JSON (array order IS respected for tags) after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography, Row, Col, List } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const { Text } = Typography;

const INITIAL_JSON = {
  enabled: false,
  level: 'debug',
  tags: ['api']
};

const TARGET_JSON = {
  enabled: true,
  level: 'info',
  tags: ['billing', 'api']
};

export default function T09({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (jsonEquals(committedValue, TARGET_JSON)) {
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

  const obj = jsonValue as { enabled: boolean; level: string; tags: string[] };

  const updateField = (field: string, value: JsonValue) => {
    setJsonValue({ ...obj, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim()) {
      setJsonValue({ ...obj, tags: [...obj.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...obj.tags];
    newTags.splice(index, 1);
    setJsonValue({ ...obj, tags: newTags });
  };

  const moveTag = (fromIndex: number, toIndex: number) => {
    const newTags = [...obj.tags];
    const [removed] = newTags.splice(fromIndex, 1);
    newTags.splice(toIndex, 0, removed);
    setJsonValue({ ...obj, tags: newTags });
  };

  return (
    <Card title="Logging configuration" style={{ width: 700 }} data-testid="json-editor-card">
      <Row gutter={24}>
        <Col span={14}>
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
          <div style={{ minHeight: 200, marginBottom: 16 }}>
            {mode === 'tree' ? (
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Space>
                    <Text code>enabled:</Text>
                    <Switch
                      size="small"
                      checked={obj.enabled}
                      onChange={(checked) => updateField('enabled', checked)}
                    />
                  </Space>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Space>
                    <Text code>level:</Text>
                    <Input
                      size="small"
                      value={obj.level}
                      onChange={(e) => updateField('level', e.target.value)}
                      style={{ width: 120 }}
                      data-testid="level-input"
                    />
                  </Space>
                </div>
                <div>
                  <Text code style={{ display: 'block', marginBottom: 4 }}>tags:</Text>
                  <List
                    size="small"
                    bordered
                    dataSource={obj.tags}
                    renderItem={(tag, index) => (
                      <List.Item
                        actions={[
                          <Button
                            key="delete"
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => removeTag(index)}
                          />
                        ]}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('index', String(index))}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const fromIndex = parseInt(e.dataTransfer.getData('index'));
                          moveTag(fromIndex, index);
                        }}
                        style={{ cursor: 'grab', padding: '2px 8px' }}
                      >
                        <Text code>{`"${tag}"`}</Text>
                      </List.Item>
                    )}
                  />
                  <Space style={{ marginTop: 8 }}>
                    <Input
                      size="small"
                      placeholder="New tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onPressEnter={addTag}
                      style={{ width: 100 }}
                    />
                    <Button size="small" icon={<PlusOutlined />} onClick={addTag}>Add</Button>
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
                  rows={8}
                  style={{ fontFamily: 'monospace' }}
                  status={codeError ? 'error' : undefined}
                />
                {codeError && <Text type="danger" style={{ fontSize: 12 }}>{codeError}</Text>}
              </div>
            )}
          </div>
          <Space>
            <Button type="primary" onClick={handleApply} disabled={mode === 'code' && !!codeError}>
              Apply
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </Col>
        <Col span={10}>
          <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, height: '100%' }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Target JSON</Text>
            <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(TARGET_JSON, null, 2)}
            </pre>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
