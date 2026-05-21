'use client';

/**
 * autocomplete_freeform-mantine-v2-T03: Drawer replacement under maxTags saturation
 *
 * Left drawer with TagsInput "Rollout tags". maxTags=3, clearable.
 * Starts saturated with {alpha, beta, gamma}. Replace beta and gamma with
 * delta and epsilon, ending at exactly {alpha, delta, epsilon}.
 * Click "Apply rollout tags".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, Drawer, Group, Stack, TagsInput, Text, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const tagSuggestions = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];

const setsEqual = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['alpha', 'beta', 'gamma']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleApply = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (setsEqual(tags, ['alpha', 'delta', 'epsilon'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, tags, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: '60vh' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="sm">Rollout Configuration</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage feature rollout tags for staged deployments.
        </Text>
        <Group gap="xs" mb="md">
          <Badge variant="light">Phase: staging</Badge>
          <Badge variant="light" color="orange">Regions: 3</Badge>
        </Group>
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>Edit rollout tags</Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Edit rollout tags"
        position="left"
        size="sm"
      >
        <Stack gap="lg" style={{ height: '100%' }}>
          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm" mb={8}>Rollout tags</Text>
            <TagsInput
              data-testid="rollout-tags"
              placeholder="Add tag"
              data={tagSuggestions}
              value={tags}
              onChange={setTags}
              maxTags={3}
              clearable
            />
          </div>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Apply rollout tags</Button>
          </Group>
        </Stack>
      </Drawer>
    </div>
  );
}
