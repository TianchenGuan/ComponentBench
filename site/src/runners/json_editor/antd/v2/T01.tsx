'use client';

/**
 * json_editor-antd-v2-T01: Override config maxUsers with local apply
 *
 * Two stacked JSON editor cards: "Primary config (JSON)" and "Override config (JSON)".
 * Both start in Tree mode with Tree/Code tabs and their own Apply button.
 * Only the Override editor's limits.maxUsers should change to 50.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tree, Input, Switch, Typography } from 'antd';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const { Text } = Typography;

const PRIMARY_JSON = {
  limits: { maxUsers: 25, maxProjects: 10 },
  features: { beta: false },
};

const OVERRIDE_JSON = {
  limits: { maxUsers: 10, maxProjects: 5 },
  features: { beta: false },
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
  onUpdate: (path: string[], val: JsonValue) => void,
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
          <Input size="small" value={value} onChange={(e) => onUpdate(p, e.target.value)} style={{ width: 150 }} />
        </Space>
      );
    } else {
      title = <Text code>{key}</Text>;
    }
    const hasChildren = typeof value === 'object' && value !== null && !Array.isArray(value);
    return { key: k, title, children: hasChildren ? buildTree(value, p, onUpdate) : undefined };
  });
}

function JsonEditorCard({
  label,
  initialJson,
  onCommit,
}: {
  label: string;
  initialJson: JsonValue;
  onCommit: (val: JsonValue) => void;
}) {
  const [json, setJson] = useState<JsonValue>(initialJson);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(initialJson, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

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
        onCommit(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
      }
    } else {
      onCommit(json);
    }
  };

  return (
    <Card title={label} style={{ width: 520, marginBottom: 16 }}>
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
      <div style={{ minHeight: 160, marginBottom: 12 }}>
        {mode === 'tree' ? (
          <Tree
            defaultExpandAll
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
              rows={8}
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
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryCommitted, setPrimaryCommitted] = useState<JsonValue>(PRIMARY_JSON);
  const [overrideCommitted, setOverrideCommitted] = useState<JsonValue>(OVERRIDE_JSON);

  useEffect(() => {
    if (successFired.current) return;
    const maxUsers = getJsonPath(overrideCommitted, '$.limits.maxUsers');
    const primaryUnchanged = jsonEquals(primaryCommitted, PRIMARY_JSON);
    if (maxUsers === 50 && primaryUnchanged) {
      successFired.current = true;
      onSuccess();
    }
  }, [overrideCommitted, primaryCommitted, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <JsonEditorCard label="Primary config (JSON)" initialJson={PRIMARY_JSON} onCommit={setPrimaryCommitted} />
      <JsonEditorCard label="Override config (JSON)" initialJson={OVERRIDE_JSON} onCommit={setOverrideCommitted} />
    </div>
  );
}
