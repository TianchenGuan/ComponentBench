'use client';

/**
 * listbox_multi-mantine-v2-T15: Feature flags modal exact subset
 *
 * Modal with one Mantine Checkbox.Group titled "Feature flags".
 * Options include confusingly similar labels: API access vs API access (legacy), SAML SSO vs SSO OIDC.
 * Initial: API access (legacy), Advanced reports.
 * Target: Audit log, API access, SAML SSO. Confirm via "Save flags". Dark theme.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Checkbox, Stack, Button, Modal, Group, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const flagOptions = [
  'Audit log', 'API access', 'API access (legacy)', 'SAML SSO',
  'SSO OIDC', 'Advanced reports', 'Data export', 'User sync',
];

const targetSet = ['Audit log', 'API access', 'SAML SSO'];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['API access (legacy)', 'Advanced reports']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 24, background: '#1a1b1e', minHeight: '100vh' }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
          <Text fw={600} size="lg" mb="xs">Feature Management</Text>
          <Text size="sm" c="dimmed" mb="md">
            Toggle feature flags for the current environment
          </Text>
          <Button onClick={() => { setModalOpen(true); setSaved(false); }}>
            Edit feature flags
          </Button>
        </Card>

        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit feature flags"
          size="sm"
        >
          <Text fw={500} mb={8}>Feature flags</Text>
          <Checkbox.Group
            value={selected}
            onChange={(vals) => { setSelected(vals); setSaved(false); }}
          >
            <Stack gap="xs">
              {flagOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
            </Stack>
          </Checkbox.Group>
          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSaved(true); setModalOpen(false); }}>Save flags</Button>
          </Group>
        </Modal>
      </div>
    </MantineProvider>
  );
}
