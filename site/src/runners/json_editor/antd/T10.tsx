'use client';

/**
 * json_editor-antd-T10: Scroll within a large JSON to enable betaUI
 *
 * The JSON editor card is anchored near the bottom-left of the viewport; the page itself does not need scrolling.
 * A Card titled "Feature flags (JSON)" contains one JSON editor starting in Tree mode.
 * The JSON document is long (dozens of keys/sections). The editor has its own internal scrollbar.
 * The object featureFlags appears far below the initial viewport of the editor, requiring scrolling inside the editor to reach it.
 * Below the editor are "Apply" and "Reset" buttons.
 * The JSON includes featureFlags.betaUI which must be set to true.
 *
 * Success: The committed JSON value at path $.featureFlags.betaUI equals true after Apply is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography } from 'antd';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const { Text } = Typography;

// Generate a long JSON with featureFlags near the bottom
const generateInitialJson = () => {
  const json: Record<string, JsonValue> = {};

  // Add many top-level sections to make it long
  json.general = { appName: 'MyApp', version: '1.0.0', environment: 'production' };
  json.database = { host: 'localhost', port: 5432, name: 'mydb', poolSize: 10 };
  json.cache = { enabled: true, ttlSeconds: 300, maxSize: 1000 };
  json.logging = { level: 'info', format: 'json', destination: 'stdout' };
  json.auth = { provider: 'oauth2', sessionTimeout: 3600, refreshEnabled: true };
  json.api = { baseUrl: '/api/v1', timeout: 30000, retries: 3 };
  json.monitoring = { enabled: true, endpoint: '/metrics', interval: 60 };
  json.notifications = { email: true, slack: false, webhook: 'https://example.com/hook' };
  json.storage = { type: 's3', bucket: 'my-bucket', region: 'us-east-1' };
  json.security = { cors: true, rateLimit: 1000, https: true };
  json.analytics = { enabled: false, provider: 'mixpanel', trackingId: 'abc123' };
  json.integrations = { stripe: true, sendgrid: false, twilio: false };

  // Feature flags at the bottom
  json.featureFlags = {
    betaUI: false,
    newSearch: false,
    fastCheckout: true
  };

  return json;
};

const INITIAL_JSON = generateInitialJson();

export default function T10({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const betaUI = getJsonPath(committedValue, '$.featureFlags.betaUI');
    if (betaUI === true) {
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
            data-testid={`switch-${path.join('.')}`}
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
            style={{ width: 80 }}
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
      title="Feature flags (JSON)"
      style={{ width: 550 }}
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
      />
      <div style={{ height: 300, overflow: 'auto', marginBottom: 16, border: '1px solid #f0f0f0', borderRadius: 4, padding: 8 }}>
        {mode === 'tree' ? (
          <Tree
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
              rows={12}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
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
