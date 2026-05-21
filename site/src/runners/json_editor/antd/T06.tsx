'use client';

/**
 * json_editor-antd-T06: Find and edit apiBaseUrl in dark theme
 *
 * Page uses a dark theme but otherwise follows the baseline isolated card layout.
 * A centered Ant Design Card titled "Service settings (JSON)" contains one JSON editor instance.
 * The editor starts in Tree mode and includes a small search field in the editor toolbar (placeholder "Search…").
 * When a search term is entered, matching keys in the tree are highlighted and the view scrolls to the match.
 * Below the editor are "Apply" (primary) and "Reset" (secondary) buttons.
 * Initial JSON:
 * {
 *   "service": "billing",
 *   "apiBaseUrl": "https://api.dev.local",
 *   "timeouts": {"connectMs": 500, "readMs": 2000},
 *   "features": {"newUI": false}
 * }
 *
 * Success: The committed JSON value at path $.apiBaseUrl equals "https://api.example.com" after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography, ConfigProvider, theme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const { Text } = Typography;

const INITIAL_JSON = {
  service: 'billing',
  apiBaseUrl: 'https://api.dev.local',
  timeouts: { connectMs: 500, readMs: 2000 },
  features: { newUI: false }
};

export default function T06({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const apiBaseUrl = getJsonPath(committedValue, '$.apiBaseUrl');
    if (apiBaseUrl === 'https://api.example.com') {
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
    setSearchTerm('');
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
    const isHighlighted = searchTerm && key.toLowerCase().includes(searchTerm.toLowerCase());
    const labelStyle = isHighlighted ? { backgroundColor: '#faad14', padding: '0 4px', borderRadius: 2 } : {};

    if (typeof value === 'boolean') {
      return (
        <Space>
          <Text code style={labelStyle}>{key}:</Text>
          <Switch size="small" checked={value} onChange={(checked) => updateJsonPath(path, checked)} />
        </Space>
      );
    }
    if (typeof value === 'number') {
      return (
        <Space>
          <Text code style={labelStyle}>{key}:</Text>
          <Input
            size="small"
            type="number"
            value={value}
            onChange={(e) => updateJsonPath(path, Number(e.target.value))}
            style={{ width: 100, background: '#333', color: '#fff', borderColor: '#555' }}
          />
        </Space>
      );
    }
    if (typeof value === 'string') {
      return (
        <Space>
          <Text code style={labelStyle}>{key}:</Text>
          <Input
            size="small"
            value={value}
            onChange={(e) => updateJsonPath(path, e.target.value)}
            style={{ width: 200, background: '#333', color: '#fff', borderColor: '#555' }}
            data-testid={`input-${path.join('.')}`}
          />
        </Space>
      );
    }
    return <Text code style={labelStyle}>{key}</Text>;
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
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', padding: 24, borderRadius: 8 }}>
        <Card
          title="Service settings (JSON)"
          style={{ width: 550, background: '#1f1f1f' }}
          data-testid="json-editor-card"
        >
          <div style={{ marginBottom: 12 }}>
            <Input
              placeholder="Search…"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200, background: '#333', borderColor: '#555' }}
              data-testid="search-input"
            />
          </div>
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
          />
          <div style={{ minHeight: 200, marginBottom: 16 }}>
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
                  rows={8}
                  style={{ fontFamily: 'monospace', background: '#333', color: '#fff', borderColor: '#555' }}
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
      </div>
    </ConfigProvider>
  );
}
