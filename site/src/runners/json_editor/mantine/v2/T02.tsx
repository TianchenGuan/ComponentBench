'use client';

/**
 * json_editor-mantine-v2-T02: Scroll to searchV2 in compact tree and save
 *
 * Mantine Card with a long JSON document in Tree mode. The target node
 * `features.experimental.searchV2` starts offscreen. Scroll to it, set true,
 * and click Save.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Paper, Text, Button, Group, Stack, Box, Switch, TextInput, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath } from '../../types';

const INITIAL_JSON: JsonValue = {
  appName: 'platform-ui',
  version: '4.2.0',
  database: { host: 'db.prod', port: 5432, pool: 15 },
  cache: { driver: 'redis', ttl: 600, maxSize: 512 },
  auth: { provider: 'oidc', sessionTimeout: 7200, mfaRequired: true },
  logging: { level: 'warn', format: 'json', destination: 'cloudwatch' },
  monitoring: { enabled: true, interval: 30, dashboard: 'grafana' },
  notifications: { email: true, sms: false, push: true },
  rateLimit: { perMinute: 100, burst: 40, enabled: true },
  deployment: { region: 'eu-central-1', replicas: 4, strategy: 'canary' },
  features: {
    darkMode: true,
    newOnboarding: false,
    checkoutV3: true,
    experimental: {
      searchV2: false,
      aiSuggestions: false,
      batchExport: true,
    },
  },
};

function RecursiveTree({
  obj,
  path,
  onUpdate,
}: {
  obj: JsonValue;
  path: string[];
  onUpdate: (root: JsonValue) => void;
}) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return null;

  return (
    <Stack gap={4} pl={path.length > 0 ? 'md' : 0}>
      {Object.entries(obj).map(([k, v]) => {
        const p = [...path, k];

        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return (
            <Box key={k}>
              <Text size="sm" ff="monospace" fw={500}>{k}:</Text>
              <RecursiveTree
                obj={v}
                path={p}
                onUpdate={(newV) => {
                  const clone = JSON.parse(JSON.stringify(obj));
                  clone[k] = newV;
                  onUpdate(clone);
                }}
              />
            </Box>
          );
        }

        if (typeof v === 'boolean') {
          return (
            <Group key={k} gap="xs">
              <Text size="sm" ff="monospace">{k}:</Text>
              <Switch
                size="xs"
                checked={v}
                onChange={(e) => {
                  const clone = JSON.parse(JSON.stringify(obj));
                  clone[k] = e.currentTarget.checked;
                  onUpdate(clone);
                }}
              />
            </Group>
          );
        }

        if (typeof v === 'number') {
          return (
            <Group key={k} gap="xs">
              <Text size="sm" ff="monospace">{k}:</Text>
              <TextInput
                size="xs"
                type="number"
                value={v}
                onChange={(e) => {
                  const clone = JSON.parse(JSON.stringify(obj));
                  clone[k] = Number(e.target.value);
                  onUpdate(clone);
                }}
                style={{ width: 100 }}
              />
            </Group>
          );
        }

        return (
          <Group key={k} gap="xs">
            <Text size="sm" ff="monospace">{k}:</Text>
            <TextInput
              size="xs"
              value={String(v)}
              onChange={(e) => {
                const clone = JSON.parse(JSON.stringify(obj));
                clone[k] = e.target.value;
                onUpdate(clone);
              }}
              style={{ width: 180 }}
            />
          </Group>
        );
      })}
    </Stack>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [committed, setCommitted] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (getJsonPath(committed, '$.features.experimental.searchV2') === true) {
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
      }
    } else {
      setCommitted(json);
    }
  };

  return (
    <Box p="lg" style={{ maxHeight: '100vh', overflow: 'auto' }}>
      <Paper shadow="sm" p="md" withBorder style={{ width: 480, marginBottom: 16 }}>
        <Text fw={600} c="dimmed" size="sm">Release notes and changelog scroll below.</Text>
      </Paper>

      <Paper shadow="sm" p="md" withBorder style={{ width: 480 }}>
        <Text fw={600} size="lg" mb="sm">Features (JSON)</Text>
        <SegmentedControl
          value={mode}
          onChange={(val) => {
            if (val === 'code') setCodeText(JSON.stringify(json, null, 2));
            else { try { setJson(JSON.parse(codeText)); } catch {} }
            setMode(val as 'tree' | 'code');
          }}
          data={[{ label: 'Tree', value: 'tree' }, { label: 'Code', value: 'code' }]}
          size="xs"
          mb="sm"
        />
        <Box style={{ maxHeight: 300, overflow: 'auto', marginBottom: 12 }}>
          {mode === 'tree' ? (
            <RecursiveTree obj={json} path={[]} onUpdate={setJson} />
          ) : (
            <Box>
              <textarea
                value={codeText}
                onChange={(e) => {
                  setCodeText(e.target.value);
                  try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); }
                }}
                rows={16}
                style={{
                  width: '100%', fontFamily: 'monospace', fontSize: 13, padding: 8,
                  border: codeError ? '1px solid red' : '1px solid #ced4da', borderRadius: 4,
                }}
              />
              {codeError && <Text size="xs" c="red">{codeError}</Text>}
            </Box>
          )}
        </Box>
        <Button onClick={handleSave} disabled={mode === 'code' && !!codeError}>Save</Button>
      </Paper>

      <Paper shadow="sm" p="md" withBorder style={{ width: 480, marginTop: 16 }}>
        <Text fw={600} size="sm">Changelog</Text>
        <Text size="xs" c="dimmed">v4.2.0 — Canary deployment support</Text>
        <Text size="xs" c="dimmed">v4.1.0 — Search improvements</Text>
      </Paper>
    </Box>
  );
}
