'use client';

/**
 * combobox_editable_multi-mantine-v2-T04
 *
 * Dashboard panel. Two searchable Mantine MultiSelect controls:
 *   - Include tags (initial: stable) — must remain unchanged
 *   - Exclude tags (initial: beta) — target
 * withCheckIcon=false, clearable. Suggestions: stable, beta, deprecated, noisy, preview, internal.
 * Success: Exclude tags = {beta, deprecated, noisy}, Include tags = {stable}, Save filters clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, MultiSelect, Button, Divider, Checkbox, Badge, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const suggestions = ['stable', 'beta', 'deprecated', 'noisy', 'preview', 'internal'];
const TARGET_SET = ['beta', 'deprecated', 'noisy'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [includeTags, setIncludeTags] = useState<string[]>(['stable']);
  const [excludeTags, setExcludeTags] = useState<string[]>(['beta']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(excludeTags, TARGET_SET) && setsEqual(includeTags, ['stable'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, excludeTags, includeTags, onSuccess]);

  const handleSave = () => setSaved(true);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '24px 48px' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 480 }}>
        <Text fw={600} size="lg" mb="sm">Alert filters</Text>
        <Stack gap="xs">
          <Checkbox defaultChecked label="Show resolved alerts" />
          <Checkbox label="Mute notifications" />
          <Group gap={6}>
            <Badge color="green" variant="light">Active</Badge>
            <Badge color="orange" variant="light">12 pending</Badge>
          </Group>
          <Divider />

          <Text fw={500} size="sm">Include tags</Text>
          <MultiSelect
            placeholder="Select tags to include"
            data={suggestions}
            value={includeTags}
            onChange={(v) => { setIncludeTags(v); setSaved(false); }}
            searchable
            clearable
            withCheckIcon={false}
          />

          <Text fw={500} size="sm">Exclude tags</Text>
          <MultiSelect
            placeholder="Select tags to exclude"
            data={suggestions}
            value={excludeTags}
            onChange={(v) => { setExcludeTags(v); setSaved(false); }}
            searchable
            clearable
            withCheckIcon={false}
          />

          <Button size="sm" onClick={handleSave} mt="xs">
            Save filters
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
