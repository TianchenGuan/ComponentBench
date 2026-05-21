'use client';

/**
 * json_editor-antd-T04: Reset table preferences JSON to defaults
 *
 * Page shows a centered Ant Design Card titled "Table preferences (JSON)".
 * An embedded JSON editor is displayed in Tree mode.
 * Below the editor are two buttons: "Apply" (primary) and "Reset" (secondary).
 * The page indicates the editor currently has unsaved changes (e.g., a small "Modified" tag).
 * Current (dirty) JSON shown in the editor at load:
 * {
 *   "sort": "date",
 *   "pageSize": 50,
 *   "showArchived": true
 * }
 * Clicking Reset restores the saved default JSON immediately (no extra confirmation).
 * Target saved default JSON is:
 * {
 *   "sort": "name",
 *   "pageSize": 20,
 *   "showArchived": false
 * }
 *
 * Success: The committed JSON document equals the target (default) JSON after Reset is clicked.
 * No explicit confirmation required - live state is used.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography, Tag } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const { Text } = Typography;

const DIRTY_JSON = {
  sort: 'date',
  pageSize: 50,
  showArchived: true
};

const DEFAULT_JSON = {
  sort: 'name',
  pageSize: 20,
  showArchived: false
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(DIRTY_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(DIRTY_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(true);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (jsonEquals(jsonValue, DEFAULT_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  }, [jsonValue, onSuccess]);

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
        setIsModified(!jsonEquals(parsed, DEFAULT_JSON));
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      setIsModified(!jsonEquals(jsonValue, DEFAULT_JSON));
    }
  };

  const handleReset = () => {
    setJsonValue(DEFAULT_JSON);
    setCodeText(JSON.stringify(DEFAULT_JSON, null, 2));
    setCodeError(null);
    setIsModified(false);
  };

  const updateJsonPath = (path: string[], value: JsonValue) => {
    const newJson = JSON.parse(JSON.stringify(jsonValue));
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJsonValue(newJson);
    setIsModified(true);
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
      title={
        <Space>
          <span>Table preferences (JSON)</span>
          {isModified && <Tag color="orange">Modified</Tag>}
        </Space>
      }
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
      <div style={{ minHeight: 180, marginBottom: 16 }}>
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
                setIsModified(true);
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
