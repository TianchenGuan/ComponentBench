'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Text, TextInput, Checkbox, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const features = [
  'Audit log', 'Audit log export', 'API access', 'API access (legacy)',
  'SAML SSO', 'OIDC SSO', 'SCIM', 'SCIM Sync',
  'Two-factor authentication', 'IP allowlisting', 'Custom domains',
  'Webhooks', 'Custom roles', 'Data export', 'Data import',
  'Advanced analytics', 'Real-time monitoring', 'Custom dashboards',
  'Email notifications', 'Slack integration', 'Teams integration',
  'Jira integration', 'GitHub integration', 'GitLab integration',
  'Bitbucket integration', 'Jenkins integration', 'CircleCI integration',
  'Custom workflows', 'Approval chains', 'Audit trail',
  'Compliance reports', 'SLA monitoring', 'Uptime tracking',
  'Incident management', 'Change management', 'Release management',
  'Feature flags', 'A/B testing', 'User segmentation',
  'Custom branding', 'White labeling', 'Multi-tenancy',
  'SSO federation', 'Directory sync',
];

const TARGET = ['Audit log', 'API access', 'SAML SSO', 'SCIM'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T15({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(not(features, ['API access (legacy)', 'OIDC SSO']));
  const [right, setRight] = useState(['API access (legacy)', 'OIDC SSO']);
  const [filter, setFilter] = useState('');
  const [committed, setCommitted] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && committed && setsEqual(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleApply = () => {
    setCommitted([...right]);
    setOpen(false);
  };

  const toggle = (v: string) =>
    setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const moveRight = () => {
    const sel = checked.filter(v => left.includes(v));
    setRight(prev => [...prev, ...sel]);
    setLeft(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const moveLeft = () => {
    const sel = checked.filter(v => right.includes(v));
    setLeft(prev => [...prev, ...sel]);
    setRight(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const filteredLeft = filter
    ? left.filter(v => v.toLowerCase().includes(filter.toLowerCase()))
    : left;

  return (
    <div style={{ padding: 24 }}>
      <Text fw={600} size="lg" mb="xs">Feature management</Text>
      <Text size="sm" c="dimmed" mb="md">Manage the feature allowlist for this tenant.</Text>
      <Button onClick={() => setOpen(true)}>Feature allowlist</Button>
      <Drawer opened={open} onClose={() => setOpen(false)} title="Enabled features" position="left" size="lg">
        <Text fw={500} size="sm" mb={8}>Enabled features</Text>
        <Group align="flex-start" gap="sm">
          <Paper withBorder p="xs" style={{ width: 220 }}>
            <Text fw={500} size="sm" mb={4}>Available</Text>
            <TextInput
              size="xs"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              mb={8}
            />
            <ScrollArea h={300}>
              <Stack gap={2}>
                {filteredLeft.map(v => (
                  <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />
                ))}
              </Stack>
            </ScrollArea>
          </Paper>
          <Stack gap={4} justify="center" mt={80}>
            <Button size="xs" variant="default" onClick={moveRight}
              disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
            <Button size="xs" variant="default" onClick={moveLeft}
              disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
          </Stack>
          <Paper withBorder p="xs" style={{ width: 220 }}>
            <Text fw={500} size="sm" mb={4}>Selected</Text>
            <ScrollArea h={340}>
              <Stack gap={2}>
                {right.map(v => (
                  <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />
                ))}
              </Stack>
            </ScrollArea>
          </Paper>
        </Group>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleApply}>Apply allowlist</Button>
        </Group>
      </Drawer>
    </div>
  );
}
