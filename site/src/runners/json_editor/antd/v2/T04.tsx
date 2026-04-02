'use client';

/**
 * json_editor-antd-v2-T04: Search integrations and add nested Slack object
 *
 * Dashboard card with one JSON editor in Tree mode, a built-in search field,
 * and a "Save runtime config" button. The document has multiple sections;
 * `integrations` is not initially visible. Add `slack: {enabled: true, channel: "#alerts"}`
 * under `integrations` and save.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, Button, Input, Tree, Switch, Typography, Space, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const { Text } = Typography;

const INITIAL_JSON: JsonValue = {
  appName: 'dashboard',
  version: '2.1.0',
  logging: { level: 'warn', format: 'json' },
  cache: { ttl: 300, driver: 'redis' },
  auth: { provider: 'oauth2', timeout: 30 },
  integrations: { email: { enabled: true } },
  monitoring: { enabled: true, interval: 60 },
};

function updateAtPath(obj: JsonValue, path: string[], value: JsonValue): JsonValue {
  const clone = JSON.parse(JSON.stringify(obj));
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return clone;
}

function addChild(obj: JsonValue, parentPath: string[], key: string, value: JsonValue): JsonValue {
  const clone = JSON.parse(JSON.stringify(obj));
  let cur: Record<string, JsonValue> = clone;
  for (const p of parentPath) {
    if (cur[p] === undefined || cur[p] === null || typeof cur[p] !== 'object') {
      cur[p] = {};
    }
    cur = cur[p] as Record<string, JsonValue>;
  }
  cur[key] = value;
  return clone;
}

type TN = { key: string; title: React.ReactNode; children?: TN[] };

function buildTree(
  obj: JsonValue,
  path: string[],
  onUpdate: (p: string[], v: JsonValue) => void,
  search: string,
): TN[] {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return [];
  return Object.entries(obj).map(([key, value]) => {
    const p = [...path, key];
    const k = p.join('.');
    const highlight = search && key.toLowerCase().includes(search.toLowerCase());
    let title: React.ReactNode;
    if (typeof value === 'boolean') {
      title = (
        <Space>
          <Text code style={highlight ? { background: '#fff566' } : undefined}>{key}:</Text>
          <Switch size="small" checked={value} onChange={(c) => onUpdate(p, c)} />
        </Space>
      );
    } else if (typeof value === 'number') {
      title = (
        <Space>
          <Text code style={highlight ? { background: '#fff566' } : undefined}>{key}:</Text>
          <Input size="small" type="number" value={value} onChange={(e) => onUpdate(p, Number(e.target.value))} style={{ width: 100 }} />
        </Space>
      );
    } else if (typeof value === 'string') {
      title = (
        <Space>
          <Text code style={highlight ? { background: '#fff566' } : undefined}>{key}:</Text>
          <Input size="small" value={value} onChange={(e) => onUpdate(p, e.target.value)} style={{ width: 150 }} />
        </Space>
      );
    } else {
      title = <Text code style={highlight ? { background: '#fff566' } : undefined}>{key}</Text>;
    }
    const hasChildren = typeof value === 'object' && value !== null && !Array.isArray(value);
    return { key: k, title, children: hasChildren ? buildTree(value, p, onUpdate, search) : undefined };
  });
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [committed, setCommitted] = useState<JsonValue>(INITIAL_JSON);
  const [search, setSearch] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [addParent, setAddParent] = useState('');
  const successFired = useRef(false);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    const slack = getJsonPath(committed, '$.integrations.slack');
    if (
      slack !== undefined &&
      typeof slack === 'object' &&
      slack !== null &&
      !Array.isArray(slack) &&
      (slack as Record<string, JsonValue>).enabled === true &&
      (slack as Record<string, JsonValue>).channel === '#alerts'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(json, null, 2));
      setCodeError(null);
    }
  }, [json, mode]);

  const handleSave = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJson(parsed);
        setCommitted(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      setCommitted(json);
    }
  };

  const handleAddChild = () => {
    if (!addParent || !newKey) return;
    try {
      const parsedVal = JSON.parse(newVal);
      setJson(addChild(json, addParent.split('.'), newKey, parsedVal));
      setNewKey('');
      setNewVal('');
      setAddParent('');
    } catch {
      try {
        setJson(addChild(json, addParent.split('.'), newKey, newVal));
        setNewKey('');
        setNewVal('');
        setAddParent('');
      } catch { /* ignore */ }
    }
  };

  const expandedKeys = useMemo(() => {
    const keys: string[] = [];
    const walk = (obj: JsonValue, path: string[]) => {
      if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return;
      Object.entries(obj).forEach(([key, value]) => {
        const p = [...path, key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          keys.push(p.join('.'));
          walk(value, p);
        }
      });
    };
    walk(json, []);
    return keys;
  }, [json]);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 16 }}>
      <Card style={{ width: 200 }}>
        <Text strong>Dashboard</Text>
        <div style={{ marginTop: 12, color: '#888', fontSize: 12 }}>
          <div>Status: running</div>
          <div>Uptime: 14d 3h</div>
          <div>Version: 2.1.0</div>
        </div>
      </Card>
      <Card title="Runtime config (JSON)" style={{ width: 520 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search keys…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
          size="small"
          allowClear
        />
        <Tabs
          activeKey={mode}
          onChange={(k) => {
            if (k === 'code') setCodeText(JSON.stringify(json, null, 2));
            else {
              try { setJson(JSON.parse(codeText)); } catch { /* keep */ }
            }
            setMode(k as 'tree' | 'code');
          }}
          items={[{ key: 'tree', label: 'Tree' }, { key: 'code', label: 'Code' }]}
          size="small"
        />
        <div style={{ minHeight: 240, maxHeight: 400, overflow: 'auto', marginBottom: 12 }}>
          {mode === 'tree' ? (
            <>
              <Tree
                expandedKeys={expandedKeys}
                autoExpandParent
                selectable={false}
                treeData={buildTree(json, [], (p, v) => setJson(updateAtPath(json, p, v)), search)}
              />
              <div style={{ marginTop: 8, padding: 8, background: '#fafafa', borderRadius: 4 }}>
                <Text style={{ fontSize: 12 }}>Add child node:</Text>
                <Space style={{ marginTop: 4 }} size={4}>
                  <Input size="small" placeholder="parent.path" value={addParent} onChange={(e) => setAddParent(e.target.value)} style={{ width: 120 }} />
                  <Input size="small" placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} style={{ width: 80 }} />
                  <Input size="small" placeholder='value (JSON)' value={newVal} onChange={(e) => setNewVal(e.target.value)} style={{ width: 140 }} />
                  <Button size="small" onClick={handleAddChild}>Add</Button>
                </Space>
              </div>
            </>
          ) : (
            <div>
              <Input.TextArea
                value={codeText}
                onChange={(e) => {
                  setCodeText(e.target.value);
                  try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); }
                }}
                rows={12}
                style={{ fontFamily: 'monospace' }}
                status={codeError ? 'error' : undefined}
              />
              {codeError && <Text type="danger" style={{ fontSize: 12 }}>{codeError}</Text>}
            </div>
          )}
        </div>
        <Button type="primary" onClick={handleSave} disabled={mode === 'code' && !!codeError}>
          Save runtime config
        </Button>
      </Card>
    </div>
  );
}
