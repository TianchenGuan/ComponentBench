'use client';

/**
 * autocomplete_restricted-mantine-v2-T04
 *
 * Modal with three searchable Mantine Selects for approvers.
 * allowDeselect={false} so re-clicking the selected option won't clear it.
 * Success: Backup approver = Nina Shah, Primary approver stays Alex Kim,
 *          Escalation approver stays Morgan Lee, Save approvers clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, Select, Button, Group, Stack, Card } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const approverOptions = [
  { label: 'Alex Kim', value: 'Alex Kim' },
  { label: 'Nina Shah', value: 'Nina Shah' },
  { label: 'Morgan Lee', value: 'Morgan Lee' },
  { label: 'Priya Singh', value: 'Priya Singh' },
  { label: 'Dana Wu', value: 'Dana Wu' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [primaryApprover, setPrimaryApprover] = useState<string | null>('Alex Kim');
  const [backupApprover, setBackupApprover] = useState<string | null>(null);
  const [escalationApprover, setEscalationApprover] = useState<string | null>('Morgan Lee');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      backupApprover === 'Nina Shah' &&
      primaryApprover === 'Alex Kim' &&
      escalationApprover === 'Morgan Lee'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, backupApprover, primaryApprover, escalationApprover, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <Card shadow="xs" padding="md" radius="md" withBorder style={{ width: 360, textAlign: 'center' }}>
        <Text fw={500} mb="xs">Current approvers</Text>
        <Text size="sm" c="dimmed" mb="md">
          Primary: {primaryApprover ?? '—'} · Backup: {backupApprover ?? '—'} · Escalation: {escalationApprover ?? '—'}
        </Text>
        <Button onClick={() => { setModalOpen(true); setSaved(false); }}>Edit approvers</Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit approvers"
        size="sm"
        centered
      >
        <Stack gap="sm">
          <Text fw={500} size="sm">Primary approver</Text>
          <Select
            size="sm"
            placeholder="Select approver"
            data={approverOptions}
            value={primaryApprover}
            onChange={(v) => { setPrimaryApprover(v); setSaved(false); }}
            searchable
            allowDeselect={false}
          />

          <Text fw={500} size="sm">Backup approver</Text>
          <Select
            size="sm"
            placeholder="Select approver"
            data={approverOptions}
            value={backupApprover}
            onChange={(v) => { setBackupApprover(v); setSaved(false); }}
            searchable
            allowDeselect={false}
          />

          <Text fw={500} size="sm">Escalation approver</Text>
          <Select
            size="sm"
            placeholder="Select approver"
            data={approverOptions}
            value={escalationApprover}
            onChange={(v) => { setEscalationApprover(v); setSaved(false); }}
            searchable
            allowDeselect={false}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save approvers</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
