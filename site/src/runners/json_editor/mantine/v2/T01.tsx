'use client';

/**
 * json_editor-mantine-v2-T01: Drawer duplicate editors — add Slack to Service B only
 *
 * Mantine Drawer with two side-by-side JSON editors: "Service A config (JSON)"
 * and "Service B config (JSON)". Both have search fields and local Save buttons.
 * Add `integrations.slack = {enabled: true, channel: "#alerts"}` to Service B
 * and click its Save. Service A must remain unchanged.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Group, Stack, Box, Drawer, Divider } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const SERVICE_A_JSON: JsonValue = {
  integrations: { email: { enabled: true } },
};

const SERVICE_B_JSON: JsonValue = {
  integrations: { email: { enabled: false } },
};

function RecursiveTree({
  obj,
  path,
  onUpdate,
  search,
}: {
  obj: JsonValue;
  path: string[];
  onUpdate: (root: JsonValue) => void;
  search: string;
}) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return null;

  return (
    <Stack gap={4} pl={path.length > 0 ? 'md' : 0}>
      {Object.entries(obj).map(([k, v]) => {
        const p = [...path, k];
        const highlight = search && k.toLowerCase().includes(search.toLowerCase());
        const labelStyle = highlight ? { background: '#fff9c4', padding: '0 4px', borderRadius: 2 } : {};

        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return (
            <Box key={k}>
              <Text size="sm" ff="monospace" style={labelStyle}>{k}:</Text>
              <RecursiveTree
                obj={v}
                path={p}
                onUpdate={(newV) => {
                  const clone = JSON.parse(JSON.stringify(obj));
                  clone[k] = newV;
                  onUpdate(clone);
                }}
                search={search}
              />
            </Box>
          );
        }

        if (typeof v === 'boolean') {
          return (
            <Group key={k} gap="xs">
              <Text size="sm" ff="monospace" style={labelStyle}>{k}:</Text>
              <Button
                size="compact-xs"
                variant={v ? 'filled' : 'light'}
                onClick={() => {
                  const clone = JSON.parse(JSON.stringify(obj));
                  clone[k] = !v;
                  onUpdate(clone);
                }}
              >
                {String(v)}
              </Button>
            </Group>
          );
        }

        if (typeof v === 'number') {
          return (
            <Group key={k} gap="xs">
              <Text size="sm" ff="monospace" style={labelStyle}>{k}:</Text>
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
            <Text size="sm" ff="monospace" style={labelStyle}>{k}:</Text>
            <TextInput
              size="xs"
              value={String(v)}
              onChange={(e) => {
                const clone = JSON.parse(JSON.stringify(obj));
                clone[k] = e.target.value;
                onUpdate(clone);
              }}
              style={{ width: 160 }}
            />
          </Group>
        );
      })}
    </Stack>
  );
}

function EditorPanel({
  label,
  initialJson,
  onCommit,
}: {
  label: string;
  initialJson: JsonValue;
  onCommit: (v: JsonValue) => void;
}) {
  const [json, setJson] = useState<JsonValue>(initialJson);
  const [search, setSearch] = useState('');
  const [addParent, setAddParent] = useState('');
  const [addKey, setAddKey] = useState('');
  const [addVal, setAddVal] = useState('');
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(initialJson, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(json, null, 2));
      setCodeError(null);
    }
  }, [json, mode]);

  const handleAddChild = () => {
    if (!addKey) return;
    let parsedVal: JsonValue;
    try { parsedVal = JSON.parse(addVal); } catch { parsedVal = addVal; }
    const clone = JSON.parse(JSON.stringify(json));
    let target: Record<string, JsonValue> = clone;
    if (addParent) {
      for (const seg of addParent.split('.')) {
        if (target[seg] === undefined || target[seg] === null || typeof target[seg] !== 'object') {
          target[seg] = {};
        }
        target = target[seg] as Record<string, JsonValue>;
      }
    }
    target[addKey] = parsedVal;
    setJson(clone);
    setAddParent('');
    setAddKey('');
    setAddVal('');
  };

  const handleSave = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJson(parsed);
        onCommit(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      onCommit(json);
    }
  };

  return (
    <Box style={{ flex: 1 }}>
      <Text fw={600} size="sm" mb="xs">{label}</Text>
      <TextInput
        size="xs"
        placeholder="Search keys…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftSection={<IconSearch size={14} />}
        mb="xs"
      />
      <Group gap={4} mb="xs">
        <Button size="compact-xs" variant={mode === 'tree' ? 'filled' : 'light'} onClick={() => { setMode('tree'); try { setJson(JSON.parse(codeText)); } catch {} }}>Tree</Button>
        <Button size="compact-xs" variant={mode === 'code' ? 'filled' : 'light'} onClick={() => { setMode('code'); setCodeText(JSON.stringify(json, null, 2)); }}>Code</Button>
      </Group>
      <Box mih={120} mb="xs">
        {mode === 'tree' ? (
          <>
            <RecursiveTree obj={json} path={[]} onUpdate={setJson} search={search} />
            <Divider my="xs" />
            <Text size="xs" c="dimmed">Add child node:</Text>
            <Group gap={4} mt={4}>
              <TextInput size="xs" placeholder="parent.path" value={addParent} onChange={(e) => setAddParent(e.target.value)} style={{ width: 100 }} />
              <TextInput size="xs" placeholder="key" value={addKey} onChange={(e) => setAddKey(e.target.value)} style={{ width: 70 }} />
              <TextInput size="xs" placeholder='value (JSON)' value={addVal} onChange={(e) => setAddVal(e.target.value)} style={{ width: 120 }} />
              <Button size="compact-xs" onClick={handleAddChild}>Add</Button>
            </Group>
          </>
        ) : (
          <Box>
            <textarea
              value={codeText}
              onChange={(e) => {
                setCodeText(e.target.value);
                try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); }
              }}
              rows={8}
              style={{
                width: '100%', fontFamily: 'monospace', fontSize: 13, padding: 8,
                border: codeError ? '1px solid red' : '1px solid #ced4da', borderRadius: 4,
              }}
            />
            {codeError && <Text size="xs" c="red">{codeError}</Text>}
          </Box>
        )}
      </Box>
      <Button size="xs" onClick={handleSave} disabled={mode === 'code' && !!codeError}>Save</Button>
    </Box>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successFired = useRef(false);
  const [aCommitted, setACommitted] = useState<JsonValue>(SERVICE_A_JSON);
  const [bCommitted, setBCommitted] = useState<JsonValue>(SERVICE_B_JSON);

  useEffect(() => {
    if (successFired.current) return;
    const isValidSlack = (s: JsonValue | undefined) =>
      s !== undefined &&
      typeof s === 'object' && s !== null && !Array.isArray(s) &&
      (s as Record<string, JsonValue>).enabled === true &&
      (s as Record<string, JsonValue>).channel === '#alerts';
    const slack = getJsonPath(bCommitted, '$.integrations.slack') ?? getJsonPath(bCommitted, '$.slack');
    if (isValidSlack(slack) && jsonEquals(aCommitted, SERVICE_A_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  }, [bCommitted, aCommitted, onSuccess]);

  return (
    <Box p="lg">
      <Paper shadow="sm" p="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="sm">Integrations</Text>
        <Text size="sm" c="dimmed" mb="md">Manage service integration configs.</Text>
        <Button onClick={() => setDrawerOpen(true)}>Integrations</Button>
      </Paper>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="xl"
        title="Integrations"
      >
        <Group align="flex-start" gap="md" grow>
          <EditorPanel label="Service A config (JSON)" initialJson={SERVICE_A_JSON} onCommit={setACommitted} />
          <EditorPanel label="Service B config (JSON)" initialJson={SERVICE_B_JSON} onCommit={setBCommitted} />
        </Group>
      </Drawer>
    </Box>
  );
}
