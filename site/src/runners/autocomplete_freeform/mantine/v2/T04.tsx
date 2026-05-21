'use client';

/**
 * autocomplete_freeform-mantine-v2-T04: Modal office autocomplete with auto-select-on-blur hazard
 *
 * Reference pill shows target office code `ZRH-HQ`. Click "Assign office" to open a modal.
 * Autocomplete with autoSelectOnBlur and near-miss options (ZRH-Lab, ZRH-Helpdesk, ZRM-HQ).
 * Select `ZRH-HQ` from suggestions and click "Save office".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Autocomplete, Badge, Button, Card, Group, Modal, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const officeOptions = ['ZRH-HQ', 'ZRH-Lab', 'ZRH-Helpdesk', 'ZRM-HQ'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [fromSuggestion, setFromSuggestion] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleSave = useCallback(() => {
    setSaved(true);
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (value === 'ZRH-HQ' && fromSuggestion) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, fromSuggestion, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
        <Text fw={600} size="lg" mb="sm">Office Assignment</Text>
        <Text size="sm" c="dimmed" mb="md">
          Assign the employee to the office shown in the reference below.
        </Text>

        <Group mb="md">
          <Text size="sm" fw={500}>Target office:</Text>
          <Badge
            data-testid="office-reference-pill"
            variant="filled"
            color="blue"
            size="lg"
          >
            ZRH-HQ
          </Badge>
        </Group>

        <Text size="xs" c="dimmed" mb="md">Active offices: 4 | Pending transfers: 2</Text>

        <Button onClick={() => setModalOpen(true)}>Assign office</Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign office"
        centered
      >
        <Stack gap="md">
          <div>
            <Text fw={500} size="sm" mb={8}>Office</Text>
            <Autocomplete
              data-testid="office-autocomplete"
              placeholder="Search office code"
              data={officeOptions}
              value={value}
              onChange={(val) => {
                setValue(val);
                setFromSuggestion(officeOptions.includes(val));
              }}
            />
          </div>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save office</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
