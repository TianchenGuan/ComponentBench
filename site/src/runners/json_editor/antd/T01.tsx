'use client';

/**
 * json_editor-antd-T01: Enable email notifications flag
 *
 * Page shows a single centered Ant Design Card titled "Notification settings (JSON)".
 * Inside the card is an embedded JSON editor widget with a mode switch (Tabs: "Tree" and "Code").
 * It starts in Tree mode.
 * In Tree mode, the JSON is shown as an expandable tree; boolean values can be edited via an inline true/false control.
 * Below the editor are two buttons: a primary "Apply" button and a secondary "Reset" button.
 * Initial JSON value:
 * {
 *   "notifications": {"email": false, "sms": true},
 *   "theme": "light"
 * }
 *
 * Success: The committed JSON value at path $.notifications.email equals true after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, jsonEquals } from '../types';

const { Text } = Typography;

const INITIAL_JSON = {
  notifications: { email: false, sms: true },
  theme: 'light'
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  // Check for success when committed value changes
  useEffect(() => {
    if (successFired.current) return;
    const emailValue = getJsonPath(committedValue, '$.notifications.email');
    if (emailValue === true) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  // Sync code text when jsonValue changes (from tree edits)
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
            data-testid={`switch-${path.join('.')}`}
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
    <Card
      title="Notification settings (JSON)"
      style={{ width: 500 }}
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
              // Keep current jsonValue if code is invalid
            }
          }
          setMode(key as 'tree' | 'code');
        }}
        items={[
          { key: 'tree', label: 'Tree' },
          { key: 'code', label: 'Code' },
        ]}
      />
      <div style={{ minHeight: 200, marginBottom: 16 }}>
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
              onChange={handleCodeChange}
              rows={8}
              style={{ fontFamily: 'monospace' }}
              status={codeError ? 'error' : undefined}
            />
            {codeError && (
              <Text type="danger" style={{ fontSize: 12 }}>{codeError}</Text>
            )}
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
