'use client';

/**
 * json_editor-antd-T05: Update maxUsers in the Override config JSON (two editors)
 *
 * Page shows a single centered Ant Design Card titled "Limits configuration".
 * Inside the card there are TWO JSON editor instances of the same type, stacked vertically:
 * 1) "Primary config (JSON)"
 * 2) "Override config (JSON)"
 * Each editor has its own Tree/Code tabs and its own button row directly underneath: "Apply" and "Reset".
 * Both editors start in Tree mode.
 * Initial JSON in "Primary config (JSON)": {"limits": {"maxUsers": 25, "maxProjects": 10}, "features": {"beta": false}}
 * Initial JSON in "Override config (JSON)": {"limits": {"maxUsers": 10, "maxProjects": 5}, "features": {"beta": false}}
 *
 * Success: The committed JSON value at path $.limits.maxUsers equals 50 in the Override config (JSON) editor
 * after Apply is clicked for that editor. The correct labeled instance must satisfy the predicate.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography, Divider } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const { Text } = Typography;

const PRIMARY_INITIAL = {
  limits: { maxUsers: 25, maxProjects: 10 },
  features: { beta: false }
};

const OVERRIDE_INITIAL = {
  limits: { maxUsers: 10, maxProjects: 5 },
  features: { beta: false }
};

interface JsonEditorInstanceProps {
  label: string;
  initialJson: JsonValue;
  onCommit: (value: JsonValue) => void;
  testId: string;
}

function JsonEditorInstance({ label, initialJson, onCommit, testId }: JsonEditorInstanceProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(initialJson);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(initialJson, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

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
        onCommit(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      onCommit(jsonValue);
    }
  };

  const handleReset = () => {
    setJsonValue(initialJson);
    setCodeText(JSON.stringify(initialJson, null, 2));
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
          <Switch size="small" checked={value} onChange={(checked) => updateJsonPath(path, checked)} />
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
            data-testid={`${testId}-${path.join('.')}`}
          />
        </Space>
      );
    }
    if (typeof value === 'string') {
      return (
        <Space>
          <Text code>{key}:</Text>
          <Input size="small" value={value} onChange={(e) => updateJsonPath(path, e.target.value)} style={{ width: 150 }} />
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
    <div data-testid={testId}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>{label}</Text>
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
      <div style={{ minHeight: 120, marginBottom: 12, background: '#fafafa', padding: 8, borderRadius: 4 }}>
        {mode === 'tree' ? (
          <Tree defaultExpandAll selectable={false} treeData={buildTreeData(jsonValue)} />
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
              rows={5}
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
    </div>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [, setPrimaryCommitted] = useState<JsonValue>(PRIMARY_INITIAL);
  const [overrideCommitted, setOverrideCommitted] = useState<JsonValue>(OVERRIDE_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const maxUsers = getJsonPath(overrideCommitted, '$.limits.maxUsers');
    if (maxUsers === 50) {
      successFired.current = true;
      onSuccess();
    }
  }, [overrideCommitted, onSuccess]);

  return (
    <Card title="Limits configuration" style={{ width: 550 }} data-testid="json-editor-card">
      <JsonEditorInstance
        label="Primary config (JSON)"
        initialJson={PRIMARY_INITIAL}
        onCommit={setPrimaryCommitted}
        testId="primary-editor"
      />
      <Divider />
      <JsonEditorInstance
        label="Override config (JSON)"
        initialJson={OVERRIDE_INITIAL}
        onCommit={setOverrideCommitted}
        testId="override-editor"
      />
    </Card>
  );
}
