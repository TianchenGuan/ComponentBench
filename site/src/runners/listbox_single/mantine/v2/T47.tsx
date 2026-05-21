'use client';

/**
 * listbox_single-mantine-v2-T47: Modal label picker: set Secondary label to Legal and finish
 *
 * Document card has a "Pick labels" button. Modal with two NavLink listboxes:
 * "Primary label" (Finance, Legal, Marketing, Sales — initial: Finance, must stay) and
 * "Secondary label" (same options, initial: Marketing). Footer: "Cancel" and "Done".
 * Chips on base page change only after Done.
 *
 * Success: Secondary label = "legal", Primary label still "finance", "Done" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NavLink, Stack, Button, Modal, Group, Badge, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const labelOptions = [
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];

export default function T47({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [primaryLabel, setPrimaryLabel] = useState<string>('finance');
  const [secondaryLabel, setSecondaryLabel] = useState<string>('marketing');
  const [done, setDone] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (done && secondaryLabel === 'legal' && primaryLabel === 'finance') {
      successFired.current = true;
      onSuccess();
    }
  }, [done, secondaryLabel, primaryLabel, onSuccess]);

  const handleDone = () => {
    setDone(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="xs">Document Labels</Text>
        <Text size="sm" c="dimmed" mb="md">Classify documents with primary and secondary labels.</Text>

        <Group mb="md">
          <Badge color="blue" variant="light">
            Primary: {labelOptions.find(o => o.value === primaryLabel)?.label}
          </Badge>
          <Badge color="green" variant="light">
            Secondary: {labelOptions.find(o => o.value === secondaryLabel)?.label}
          </Badge>
        </Group>

        <Button onClick={() => setModalOpen(true)}>Pick labels</Button>
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Pick labels" size="md">
        <Stack gap="lg">
          <div>
            <Text fw={600} size="sm" mb={6}>Primary label</Text>
            <Stack
              gap={0}
              data-cb-listbox-root
              data-cb-instance="primary"
              data-cb-selected-value={primaryLabel}
              role="listbox"
              style={{ border: '1px solid #dee2e6', borderRadius: 6 }}
            >
              {labelOptions.map(opt => (
                <NavLink
                  key={opt.value}
                  label={opt.label}
                  active={primaryLabel === opt.value}
                  onClick={() => { setPrimaryLabel(opt.value); setDone(false); }}
                  data-cb-option-value={opt.value}
                  role="option"
                  aria-selected={primaryLabel === opt.value}
                />
              ))}
            </Stack>
          </div>

          <div>
            <Text fw={600} size="sm" mb={6}>Secondary label</Text>
            <Stack
              gap={0}
              data-cb-listbox-root
              data-cb-instance="secondary"
              data-cb-selected-value={secondaryLabel}
              role="listbox"
              style={{ border: '1px solid #dee2e6', borderRadius: 6 }}
            >
              {labelOptions.map(opt => (
                <NavLink
                  key={opt.value}
                  label={opt.label}
                  active={secondaryLabel === opt.value}
                  onClick={() => { setSecondaryLabel(opt.value); setDone(false); }}
                  data-cb-option-value={opt.value}
                  role="option"
                  aria-selected={secondaryLabel === opt.value}
                />
              ))}
            </Stack>
          </div>
        </Stack>

        <Divider my="md" />

        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDone}>Done</Button>
        </Group>
      </Modal>
    </div>
  );
}
