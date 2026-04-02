'use client';

/**
 * select_custom_multi-mantine-v2-T10: Visible tags panel exact-set repair
 *
 * Settings panel, compact spacing, medium clutter, top-left placement.
 * Column of unrelated toggles and pill filters above two Mantine MultiSelect fields:
 *   - "Visible tags" ← TARGET (initial: Platform Legacy, Security)
 *   - "Muted tags" (initial: Infra, must stay)
 * Options: Platform, Platform Legacy, Growth, Growth Ops, Billing, Billing Export,
 *          QA, QA Automation, Security, Infra.
 * Target: {Platform, Growth, Billing, QA}. Must keep Muted tags = {Infra}.
 * Button "Save tag rules" commits the panel state.
 *
 * Success: Visible tags = {Platform, Growth, Billing, QA},
 *          Muted tags unchanged = {Infra}, Save tag rules clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, MultiSelect, Button, Switch, Group, Stack, Divider, Pill } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const tagOptions = [
  'Platform', 'Platform Legacy', 'Growth', 'Growth Ops',
  'Billing', 'Billing Export', 'QA', 'QA Automation', 'Security', 'Infra',
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [visibleTags, setVisibleTags] = useState<string[]>(['Platform Legacy', 'Security']);
  const [mutedTags, setMutedTags] = useState<string[]>(['Infra']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(visibleTags, ['Platform', 'Growth', 'Billing', 'QA']) &&
      setsEqual(mutedTags, ['Infra'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, visibleTags, mutedTags, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400 }}>
      <Text fw={600} size="lg" mb="sm">Tag Settings</Text>

      <Stack gap="xs" mb="md">
        <Switch label="Show archived" defaultChecked={false} />
        <Switch label="Auto-tag new items" defaultChecked />
        <Group gap="xs">
          <Pill>active</Pill>
          <Pill>reviewed</Pill>
        </Group>
      </Stack>

      <Divider mb="md" />

      <Stack gap="md">
        <MultiSelect
          label="Visible tags"
          searchable
          clearable
          data={tagOptions}
          value={visibleTags}
          onChange={(v) => { setVisibleTags(v); setSaved(false); }}
          placeholder="Select visible tags"
        />

        <MultiSelect
          label="Muted tags"
          searchable
          clearable
          data={tagOptions}
          value={mutedTags}
          onChange={(v) => { setMutedTags(v); setSaved(false); }}
          placeholder="Select muted tags"
        />
      </Stack>

      <Button mt="md" fullWidth onClick={() => setSaved(true)}>Save tag rules</Button>
    </Card>
  );
}
