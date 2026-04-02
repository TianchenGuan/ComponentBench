'use client';

/**
 * listbox_single-mantine-v2-T46: Dark card: set Visibility to Private and save
 *
 * A dark settings card near the bottom-left has two compact NavLink listboxes:
 * "Audience" (Team, Public, Org — initial: Team, must stay) and "Visibility"
 * (Public, Team-only, Private — initial: Team-only). Footer: "Save changes" and "Cancel".
 * Committed only after Save.
 *
 * Success: Visibility = "private", Audience still "team", "Save changes" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NavLink, Stack, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const audienceOptions = [
  { value: 'team', label: 'Team' },
  { value: 'public', label: 'Public' },
  { value: 'org', label: 'Organization' },
];

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'team_only', label: 'Team-only' },
  { value: 'private', label: 'Private' },
];

export default function T46({ onSuccess }: TaskComponentProps) {
  const [audience, setAudience] = useState<string>('team');
  const [visibility, setVisibility] = useState<string>('team_only');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && visibility === 'private' && audience === 'team') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, visibility, audience, onSuccess]);

  return (
    <div style={{ padding: 24, minHeight: '90vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: 360, background: '#1a1b1e', border: '1px solid #373a40' }}
      >
        <Text fw={600} size="lg" mb="md" c="gray.2">Access Settings</Text>

        <Stack gap="md">
          <div>
            <Text size="sm" fw={600} mb={4} c="gray.4">Audience</Text>
            <Stack
              gap={0}
              data-cb-listbox-root
              data-cb-instance="audience"
              data-cb-selected-value={audience}
              role="listbox"
              style={{ border: '1px solid #373a40', borderRadius: 6 }}
            >
              {audienceOptions.map(opt => (
                <NavLink
                  key={opt.value}
                  label={opt.label}
                  active={audience === opt.value}
                  onClick={() => { setAudience(opt.value); setSaved(false); }}
                  data-cb-option-value={opt.value}
                  role="option"
                  aria-selected={audience === opt.value}
                  variant="filled"
                  styles={{ root: { color: '#c1c2c5' } }}
                />
              ))}
            </Stack>
          </div>

          <div>
            <Text size="sm" fw={600} mb={4} c="gray.4">Visibility</Text>
            <Stack
              gap={0}
              data-cb-listbox-root
              data-cb-instance="visibility"
              data-cb-selected-value={visibility}
              role="listbox"
              style={{ border: '1px solid #373a40', borderRadius: 6 }}
            >
              {visibilityOptions.map(opt => (
                <NavLink
                  key={opt.value}
                  label={opt.label}
                  active={visibility === opt.value}
                  onClick={() => { setVisibility(opt.value); setSaved(false); }}
                  data-cb-option-value={opt.value}
                  role="option"
                  aria-selected={visibility === opt.value}
                  variant="filled"
                  styles={{ root: { color: '#c1c2c5' } }}
                />
              ))}
            </Stack>
          </div>
        </Stack>

        <Group justify="flex-end" mt="lg" gap="xs">
          <Button variant="default" styles={{ root: { borderColor: '#373a40', color: '#c1c2c5' } }}>
            Cancel
          </Button>
          <Button onClick={() => setSaved(true)}>Save changes</Button>
        </Group>
      </Card>
    </div>
  );
}
