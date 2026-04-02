'use client';

/**
 * select_custom_single-mantine-v2-T17: Drawer approver search — choose Mina Patel and save
 *
 * Document workflow page with "Approval settings" button. Drawer opens with two searchable
 * Mantine Select controls: "Owner" (Ava Stone, must stay) and "Approver" (empty).
 * Long employee lists with avatar initials and similar names.
 * Footer: "Save approval settings" / "Cancel".
 *
 * Success: Approver = "Mina Patel", Owner still "Ava Stone", "Save approval settings" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Group, Badge, Drawer, Stack, Divider, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const employees = [
  'Aaron Mitchell', 'Adele Fernandez', 'Alex Novak', 'Alice Brennan', 'Amir Hassan',
  'Andrea Kowalski', 'Ava Sloan', 'Ava Stone', 'Blake Torres', 'Brenda Lu',
  'Calvin Rhodes', 'Carmen Vega', 'Casey Rivera', 'Charlotte Dunn', 'Dakota Reeves',
  'Danielle Okafor', 'Derek Chang', 'Drew Wang', 'Elena Rossi', 'Emery Clark',
  'Ethan Nakamura', 'Finley Ito', 'Grace Holloway', 'Harper Green', 'Isaac Mendez',
  'Jamie Fox', 'Jordan Lee', 'Kara Lindstrom', 'Liam O\'Brien', 'Lucas Tran',
  'Marina Petrov', 'Mina Pashkov', 'Mina Patel', 'Mina Patil', 'Morgan Chen',
  'Nadia Kapoor', 'Nora Eriksen', 'Parker Hughes', 'Quinn Davis', 'Riley Adams',
  'Rowan Shah', 'Sanjay Gupta', 'Selena Cruz', 'Taylor Brooks', 'Theo Larsson',
  'Uma Reddy', 'Victor Almeida', 'Wendy Chow', 'Yuki Tanaka', 'Zara Osman',
];

const employeeOptions = employees.map((e) => ({ value: e, label: e }));

export default function T17({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [owner, setOwner] = useState<string | null>('Ava Stone');
  const [approver, setApprover] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && approver === 'Mina Patel' && owner === 'Ava Stone') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, approver, owner, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  return (
    <MantineProvider>
      <div style={{ padding: 16 }}>
        <Text fw={700} size="xl" mb="md">Document Workflow</Text>

        <Group gap="sm" mb="md">
          <Badge variant="light">Pending: 8</Badge>
          <Badge variant="outline">Approved: 42</Badge>
          <Badge variant="outline" color="red">Rejected: 2</Badge>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 450, marginBottom: 16 }}>
          <Text fw={500} mb="xs">Approval Pipeline</Text>
          <Text size="sm" c="dimmed" mb="md">
            Configure approval chains for document submissions. Current queue: 8 pending reviews.
          </Text>
          <Button onClick={() => setDrawerOpen(true)}>Approval settings</Button>
        </Card>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Approval Settings"
          position="right"
          size="sm"
        >
          <Stack gap="md">
            <Select
              label="Owner"
              searchable
              data={employeeOptions}
              value={owner}
              onChange={(val) => { setOwner(val); setSaved(false); }}
              placeholder="Search employees..."
            />

            <Select
              label="Approver"
              searchable
              data={employeeOptions}
              value={approver}
              onChange={(val) => { setApprover(val); setSaved(false); }}
              placeholder="Search employees..."
            />

            <Divider />

            <Group gap="xs">
              <Badge size="sm" variant="outline">Policy: Standard</Badge>
              <Badge size="sm" variant="light">SLA: 48h</Badge>
            </Group>

            <Text size="xs" c="dimmed">
              Changes apply to all new submissions after save.
            </Text>

            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save approval settings</Button>
            </Group>
          </Stack>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
