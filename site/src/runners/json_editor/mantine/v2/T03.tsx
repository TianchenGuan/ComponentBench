'use client';

/**
 * json_editor-mantine-v2-T03: Rate limit B only — change perMinute and save
 *
 * Dark theme. Two stacked JSON editors: "Rate limit A (JSON)" and "Rate limit B (JSON)".
 * Both in Tree mode with local Save buttons. Set Rate limit B's `rateLimit.perMinute`
 * to 120, leave A unchanged, and click B's Save.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Paper, Text, Button, Group, Stack, Box, TextInput, Switch,
  SegmentedControl, MantineProvider,
} from '@mantine/core';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const RATE_A_JSON: JsonValue = {
  rateLimit: { perMinute: 60, burst: 30 },
  enabled: true,
};

const RATE_B_JSON: JsonValue = {
  rateLimit: { perMinute: 30, burst: 15 },
  enabled: true,
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
                obj={v} path={p}
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
              <Switch size="xs" checked={v} onChange={(e) => {
                const clone = JSON.parse(JSON.stringify(obj));
                clone[k] = e.currentTarget.checked;
                onUpdate(clone);
              }} />
            </Group>
          );
        }

        if (typeof v === 'number') {
          return (
            <Group key={k} gap="xs">
              <Text size="sm" ff="monospace">{k}:</Text>
              <TextInput
                size="xs" type="number" value={v}
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
            <TextInput size="xs" value={String(v)} onChange={(e) => {
              const clone = JSON.parse(JSON.stringify(obj));
              clone[k] = e.target.value;
              onUpdate(clone);
            }} style={{ width: 150 }} />
          </Group>
        );
      })}
    </Stack>
  );
}

function EditorCard({
  label,
  initialJson,
  onCommit,
}: {
  label: string;
  initialJson: JsonValue;
  onCommit: (v: JsonValue) => void;
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
    <Paper shadow="sm" p="md" withBorder style={{ width: 440, marginBottom: 16 }}>
      <Text fw={600} size="md" mb="sm">{label}</Text>
      <SegmentedControl
        value={mode}
        onChange={(val) => {
          if (val === 'code') setCodeText(JSON.stringify(json, null, 2));
          else { try { setJson(JSON.parse(codeText)); } catch {} }
          setMode(val as 'tree' | 'code');
        }}
        data={[{ label: 'Tree', value: 'tree' }, { label: 'Code', value: 'code' }]}
        size="xs" mb="sm"
      />
      <Box mih={100} mb="sm">
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
              rows={6}
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
    </Paper>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [aCommitted, setACommitted] = useState<JsonValue>(RATE_A_JSON);
  const [bCommitted, setBCommitted] = useState<JsonValue>(RATE_B_JSON);

  useEffect(() => {
    if (successFired.current) return;
    const perMinute = getJsonPath(bCommitted, '$.rateLimit.perMinute');
    const aUnchanged = jsonEquals(aCommitted, RATE_A_JSON);
    if (perMinute === 120 && aUnchanged) {
      successFired.current = true;
      onSuccess();
    }
  }, [bCommitted, aCommitted, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box p="lg">
        <EditorCard label="Rate limit A (JSON)" initialJson={RATE_A_JSON} onCommit={setACommitted} />
        <EditorCard label="Rate limit B (JSON)" initialJson={RATE_B_JSON} onCommit={setBCommitted} />
      </Box>
    </MantineProvider>
  );
}
