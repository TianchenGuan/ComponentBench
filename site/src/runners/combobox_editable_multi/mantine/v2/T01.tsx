'use client';

/**
 * combobox_editable_multi-mantine-v2-T01
 *
 * Settings panel with two TagsInput fields: "Primary labels" (target) and "Secondary labels" (distractor).
 * acceptValueOnBlur=false. Suggestions: api, ui, agent, docs, infra.
 * Initial: Primary labels = [api], Secondary labels = [docs].
 * Success: Primary labels = {api, ui, agent}, Secondary labels = {docs}, Save labels clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, TagsInput, Button, Divider, Checkbox, TextInput, Group, Badge, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const suggestions = ['api', 'ui', 'agent', 'docs', 'infra'];
const TARGET_SET = ['api', 'ui', 'agent'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [primaryLabels, setPrimaryLabels] = useState<string[]>(['api']);
  const [secondaryLabels, setSecondaryLabels] = useState<string[]>(['docs']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(primaryLabels, TARGET_SET) && setsEqual(secondaryLabels, ['docs'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, primaryLabels, secondaryLabels, onSuccess]);

  const handleSave = () => setSaved(true);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '24px 48px' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 480 }}>
        <Text fw={600} size="lg" mb="sm">Label settings</Text>
        <Stack gap="xs">
          <Checkbox defaultChecked label="Auto-assign reviewers" />
          <Checkbox label="Require approval" />
          <TextInput size="xs" placeholder="Notification email" defaultValue="team@example.com" style={{ width: '70%' }} />
          <Group gap={6}>
            <Badge color="green" variant="light">Active</Badge>
            <Badge variant="light">v2.0</Badge>
          </Group>
          <Divider />

          <Text fw={500} size="sm">Primary labels</Text>
          <TagsInput
            placeholder="Add labels"
            data={suggestions}
            value={primaryLabels}
            onChange={(v) => { setPrimaryLabels(v); setSaved(false); }}
            acceptValueOnBlur={false}
          />

          <Text fw={500} size="sm">Secondary labels</Text>
          <TagsInput
            placeholder="Add labels"
            data={suggestions}
            value={secondaryLabels}
            onChange={(v) => { setSecondaryLabels(v); setSaved(false); }}
            acceptValueOnBlur={false}
          />

          <Button size="sm" onClick={handleSave} mt="xs">
            Save labels
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
