'use client';

/**
 * json_editor-antd-v2-T05: Experiment flags far-down betaUI apply
 *
 * Nested scroll layout. AntD card with a long JSON tree editor.
 * `featureFlags.betaUI` is far below the fold. Set it to true and Apply.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, Button, Tree, Input, Switch, Typography, Space, Tabs } from 'antd';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath } from '../../types';

const { Text } = Typography;

const INITIAL_JSON: JsonValue = {
  appName: 'experiment-dashboard',
  version: '3.0.1',
  database: { host: 'db.prod.internal', port: 5432, pool: 10 },
  cache: { driver: 'memcached', ttl: 600, maxSize: 256 },
  auth: { provider: 'saml', sessionTimeout: 3600, mfa: true },
  logging: { level: 'info', format: 'structured', destination: 'stdout' },
  monitoring: { enabled: true, interval: 30, alertThreshold: 0.95 },
  deployment: { region: 'us-east-1', replicas: 3, strategy: 'rolling' },
  notifications: { email: true, sms: false, webhook: 'https://hooks.example.com' },
  rateLimit: { perMinute: 120, burst: 50, enabled: true },
  featureFlags: {
    darkMode: true,
    newDashboard: false,
    searchV2: true,
    betaUI: false,
    experimentalApi: false,
  },
};

function updateAtPath(obj: JsonValue, path: string[], value: JsonValue): JsonValue {
  const clone = JSON.parse(JSON.stringify(obj));
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return clone;
}

type TN = { key: string; title: React.ReactNode; children?: TN[] };

function buildTree(
  obj: JsonValue,
  path: string[],
  onUpdate: (p: string[], v: JsonValue) => void,
): TN[] {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return [];
  return Object.entries(obj).map(([key, value]) => {
    const p = [...path, key];
    const k = p.join('.');
    let title: React.ReactNode;
    if (typeof value === 'boolean') {
      title = (
        <Space>
          <Text code>{key}:</Text>
          <Switch size="small" checked={value} onChange={(c) => onUpdate(p, c)} />
        </Space>
      );
    } else if (typeof value === 'number') {
      title = (
        <Space>
          <Text code>{key}:</Text>
          <Input size="small" type="number" value={value} onChange={(e) => onUpdate(p, Number(e.target.value))} style={{ width: 100 }} />
        </Space>
      );
    } else if (typeof value === 'string') {
      title = (
        <Space>
          <Text code>{key}:</Text>
          <Input size="small" value={value} onChange={(e) => onUpdate(p, e.target.value)} style={{ width: 180 }} />
        </Space>
      );
    } else {
      title = <Text code>{key}</Text>;
    }
    const hasChildren = typeof value === 'object' && value !== null && !Array.isArray(value);
    return { key: k, title, children: hasChildren ? buildTree(value, p, onUpdate) : undefined };
  });
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [committed, setCommitted] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (getJsonPath(committed, '$.featureFlags.betaUI') === true) {
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

  const handleApply = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJson(parsed);
        setCommitted(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
      }
    } else {
      setCommitted(json);
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
    <div style={{ padding: 24, maxHeight: '100vh', overflow: 'auto' }}>
      <Card style={{ marginBottom: 16, width: 500 }}>
        <Text strong>Settings overview</Text>
        <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
          <div>Release notes and changelog available below.</div>
        </div>
      </Card>

      <Card title="Experiment flags (JSON)" style={{ width: 500 }}>
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
        <div style={{ maxHeight: 280, overflow: 'auto', marginBottom: 12 }}>
          {mode === 'tree' ? (
            <Tree
              expandedKeys={expandedKeys}
              autoExpandParent
              selectable={false}
              treeData={buildTree(json, [], (p, v) => setJson(updateAtPath(json, p, v)))}
            />
          ) : (
            <div>
              <Input.TextArea
                value={codeText}
                onChange={(e) => {
                  setCodeText(e.target.value);
                  try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); }
                }}
                rows={14}
                style={{ fontFamily: 'monospace' }}
                status={codeError ? 'error' : undefined}
              />
              {codeError && <Text type="danger" style={{ fontSize: 12 }}>{codeError}</Text>}
            </div>
          )}
        </div>
        <Button type="primary" onClick={handleApply} disabled={mode === 'code' && !!codeError}>
          Apply
        </Button>
      </Card>

      <Card style={{ marginTop: 16, width: 500 }}>
        <Text strong>Changelog</Text>
        <ul style={{ color: '#888', fontSize: 12 }}>
          <li>v3.0.1 — Bug fixes</li>
          <li>v3.0.0 — Major release</li>
          <li>v2.9.0 — Feature flags added</li>
        </ul>
      </Card>
    </div>
  );
}
