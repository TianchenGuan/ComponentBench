'use client';

/**
 * autocomplete_freeform-mantine-v2-T01: Primary labels only with accept-on-blur disabled
 *
 * Settings panel with two TagsInput (Primary labels, Secondary labels).
 * acceptValueOnBlur=false and maxTags=3. Primary starts with {api},
 * end with exactly {api, ui, agent}. Secondary must stay {docs}.
 * Click "Save labels".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Text, TagsInput, Button, Group, Stack, Switch, Divider, Select } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const suggestions = ['api', 'ui', 'agent', 'docs', 'infra'];

const setsEqual = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [primaryLabels, setPrimaryLabels] = useState<string[]>(['api']);
  const [secondaryLabels, setSecondaryLabels] = useState<string[]>(['docs']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleSave = useCallback(() => setSaved(true), []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (
      setsEqual(primaryLabels, ['api', 'ui', 'agent']) &&
      setsEqual(secondaryLabels, ['docs'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, primaryLabels, secondaryLabels, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 16 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 440 }}>
        <Text fw={600} size="lg" mb="md">Labels Settings</Text>

        {/* Clutter */}
        <Stack gap="xs" mb="md">
          <Group justify="space-between">
            <Text size="sm">Enable auto-assign</Text>
            <Switch defaultChecked size="sm" />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Require approval</Text>
            <Switch size="sm" />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Default project</Text>
            <Select size="xs" w={130} data={['Core', 'Edge', 'Platform']} defaultValue="Core" />
          </Group>
        </Stack>

        <Divider mb="md" />

        <Stack gap="lg">
          <div>
            <Text fw={500} size="sm" mb={8}>Primary labels</Text>
            <TagsInput
              data-testid="primary-labels"
              placeholder="Add label"
              data={suggestions}
              value={primaryLabels}
              onChange={setPrimaryLabels}
              acceptValueOnBlur={false}
              maxTags={3}
            />
          </div>
          <div>
            <Text fw={500} size="sm" mb={8}>Secondary labels</Text>
            <TagsInput
              data-testid="secondary-labels"
              placeholder="Add label"
              data={suggestions}
              value={secondaryLabels}
              onChange={setSecondaryLabels}
              acceptValueOnBlur={false}
              maxTags={3}
            />
          </div>
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button onClick={handleSave}>Save labels</Button>
        </Group>
      </Card>
    </div>
  );
}
