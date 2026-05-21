'use client';

/**
 * time_picker-mantine-v2-T38: Internal deadline 9:05 PM in Mantine dropdown picker
 *
 * Communications card: Public deadline 17:30, Internal deadline 19:00; TimeInputs for HH:mm entry.
 * "Save deadlines" commits validation.
 *
 * Success: Internal 21:05 and Public 17:30 after Save.
 */

import { useRef, useState, type ChangeEvent } from 'react';
import { Card, Text, Button, Stack, Group, Badge, Switch } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../../types';

function normHm(s: string) {
  if (!s) return '';
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return s.trim();
  return `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}`;
}

export default function T38({ onSuccess }: TaskComponentProps) {
  const [pub, setPub] = useState('17:30');
  const [internal, setInternal] = useState('19:00');
  const fired = useRef(false);

  const handleSave = () => {
    if (fired.current) return;
    if (normHm(internal) === '21:05' && normHm(pub) === '17:30') {
      fired.current = true;
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder maw={420}>
      <Text fw={600} size="sm" mb="xs">
        Communications
      </Text>
      <Group gap="xs" mb="md">
        <Badge size="xs">Draft</Badge>
        <Switch size="xs" label="Notify" defaultChecked />
      </Group>

      <Stack gap="sm">
        <div>
          <Text component="label" htmlFor="tp-public-dl" fw={500} size="xs" mb={4} style={{ display: 'block' }}>
            Public deadline
          </Text>
          <TimeInput
            id="tp-public-dl"
            value={pub}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPub(e.currentTarget.value)}
            size="xs"
            data-testid="tp-public-deadline"
          />
        </div>
        <div>
          <Text component="label" htmlFor="tp-internal-dl" fw={500} size="xs" mb={4} style={{ display: 'block' }}>
            Internal deadline
          </Text>
          <TimeInput
            id="tp-internal-dl"
            value={internal}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInternal(e.currentTarget.value)}
            size="xs"
            data-testid="tp-internal-deadline"
          />
        </div>
        <Button size="xs" onClick={handleSave} data-testid="save-deadlines">
          Save deadlines
        </Button>
      </Stack>
    </Card>
  );
}
