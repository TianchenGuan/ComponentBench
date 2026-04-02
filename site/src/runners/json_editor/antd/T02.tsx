'use client';

/**
 * json_editor-antd-T02: Set retry count in a form section
 *
 * Page shows an Ant Design form section titled "Request settings".
 * The form contains a few standard fields (e.g., Service name text input, Region select) that are NOT required for success.
 * At the bottom of the section there is a labeled JSON editor: "Retry policy (JSON)".
 * The JSON editor starts in Tree mode.
 * Numeric values are edited inline (click the number to edit).
 * A primary "Apply" button sits directly under this JSON editor (applies only this editor),
 * with a secondary "Reset" button next to it.
 * Initial JSON value in the editor:
 * {
 *   "retryCount": 1,
 *   "backoffMs": 250,
 *   "jitter": false
 * }
 *
 * Success: The committed JSON value at path $.retryCount equals 3 after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Input, Select, Tabs, Button, Space, Tree, Switch, Typography, Divider } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const { Text } = Typography;

const INITIAL_JSON = {
  retryCount: 1,
  backoffMs: 250,
  jitter: false
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const retryCount = getJsonPath(committedValue, '$.retryCount');
    if (retryCount === 3) {
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

  const updateJsonPath = (path: string[], value: JsonValue) => {
    const newJson = JSON.parse(JSON.stringify(jsonValue));
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJsonValue(newJson);
  };

  const renderTreeNode = (key: string, value: JsonValue, path: string[]): React.ReactNode => {
    if (typeof value === 'boolean') {
      return (
        <Space>
          <Text code>{key}:</Text>
          <Switch
            size="small"
            checked={value}
            onChange={(checked) => updateJsonPath(path, checked)}
          />
        </Space>
      );
    }
    if (typeof value === 'number') {
      return (
        <Space>
          <Text code>{key}:</Text>
          <Input
            size="small"
            type="number"
            value={value}
            onChange={(e) => updateJsonPath(path, Number(e.target.value))}
            style={{ width: 100 }}
            data-testid={`input-${path.join('.')}`}
          />
        </Space>
      );
    }
    if (typeof value === 'string') {
      return (
        <Space>
          <Text code>{key}:</Text>
          <Input
            size="small"
            value={value}
            onChange={(e) => updateJsonPath(path, e.target.value)}
            style={{ width: 150 }}
          />
        </Space>
      );
    }
    return <Text code>{key}</Text>;
  };

  type TreeNode = { key: string; title: React.ReactNode; children?: TreeNode[] };
  const buildTreeData = (obj: JsonValue, path: string[] = []): TreeNode[] => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return [];
    }
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = [...path, key];
      const hasChildren = typeof value === 'object' && value !== null && !Array.isArray(value);
      return {
        key: currentPath.join('.'),
        title: renderTreeNode(key, value, currentPath),
        children: hasChildren ? buildTreeData(value, currentPath) : undefined,
      };
    });
  };

  return (
    <Card title="Request settings" style={{ width: 500 }} data-testid="json-editor-card">
      <Form layout="vertical">
        <Form.Item label="Service name">
          <Input defaultValue="my-service" />
        </Form.Item>
        <Form.Item label="Region">
          <Select
            defaultValue="us-east-1"
            options={[
              { value: 'us-east-1', label: 'US East' },
              { value: 'us-west-2', label: 'US West' },
              { value: 'eu-west-1', label: 'EU West' },
            ]}
          />
        </Form.Item>
      </Form>
      <Divider />
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Retry policy (JSON)</Text>
      <Tabs
        activeKey={mode}
        onChange={(key) => {
          if (key === 'code') {
            setCodeText(JSON.stringify(jsonValue, null, 2));
          } else {
            try {
              setJsonValue(JSON.parse(codeText));
            } catch {
              // Keep current jsonValue
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
      <div style={{ minHeight: 150, marginBottom: 16 }}>
        {mode === 'tree' ? (
          <Tree
            defaultExpandAll
            selectable={false}
            treeData={buildTreeData(jsonValue)}
          />
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
    </Card>
  );
}
