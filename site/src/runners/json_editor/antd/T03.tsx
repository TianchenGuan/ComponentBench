'use client';

/**
 * json_editor-antd-T03: Replace environment JSON in Code mode
 *
 * Page shows a centered Ant Design Card titled "Environment (JSON)".
 * The card contains an embedded JSON editor with Tabs for "Tree" and "Code". It starts in Tree mode.
 * In Code mode, the editor is a plain-text JSON area with syntax highlighting and a validation message area.
 * Below the editor are "Apply" (primary) and "Reset" (secondary) buttons.
 * Initial JSON value (before editing):
 * {
 *   "env": "local",
 *   "region": "us-west-2",
 *   "debug": true
 * }
 *
 * Success: The committed JSON document equals the target JSON (whitespace-insensitive, object key order ignored):
 * { "env": "dev", "region": "us-east-1" }
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const { Text } = Typography;

const INITIAL_JSON = {
  env: 'local',
  region: 'us-west-2',
  debug: true
};

const TARGET_JSON = {
  env: 'dev',
  region: 'us-east-1'
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
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
    <Card
      title="Environment (JSON)"
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
              // Keep current jsonValue
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
    </Card>
  );
}
