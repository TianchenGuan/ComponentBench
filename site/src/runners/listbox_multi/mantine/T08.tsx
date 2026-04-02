'use client';

/**
 * listbox_multi-mantine-T08: Modal: apply report filters from long list
 *
 * Layout: modal_flow. The page shows a report with a toolbar button "Filter report".
 * Clicking it opens a centered Mantine Modal titled "Filter report".
 * Inside the modal is the target component: a scrollable Checkbox.Group labeled "Metrics" with 35 options.
 * Initial state: Revenue and New users are preselected.
 * At the bottom of the modal are buttons: "Cancel" and primary "Apply filters".
 *
 * Success: The target listbox has exactly: Active users, Churn rate, NPS. (require_confirm=true: only after Apply filters)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Button, Modal, Group, ScrollArea, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const metrics = [
  'Active users', 'New users', 'Revenue', 'Churn rate', 'NPS', 'Support tickets',
  'Session duration', 'Retention', 'MRR', 'ARR', 'LTV', 'CAC', 'DAU', 'MAU', 'WAU',
  'Signups', 'Activations', 'Conversions', 'Pageviews', 'Bounce rate', 'Time on site',
  'Feature adoption', 'API calls', 'Error rate', 'Latency', 'Uptime', 'Deployments',
  'Bugs filed', 'Bugs closed', 'PRs merged', 'Code coverage', 'Test pass rate',
  'Customer satisfaction', 'Engagement score', 'Health score',
];

const targetSet = ['Active users', 'Churn rate', 'NPS'];
const initialSelected = ['Revenue', 'New users'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalSelected, setModalSelected] = useState<string[]>(initialSelected);
  const [savedSelection, setSavedSelection] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(savedSelection, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [savedSelection, onSuccess]);

  const handleOpen = () => {
    setModalSelected([...savedSelection]);
    setIsOpen(true);
  };

  const handleApply = () => {
    setSavedSelection([...modalSelected]);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">
            Reports
          </Text>
          <Button size="sm" onClick={handleOpen}>
            Filter report
          </Button>
        </Group>
        <Text size="sm" c="dimmed" mb="md">
          Reports: Filter report (choose metrics).
        </Text>
        <Box
          style={{
            height: 150,
            background: '#f8f9fa',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text c="dimmed">[Report Chart]</Text>
        </Box>
        <Text size="sm" c="dimmed" mt="md">
          Active filters: {savedSelection.join(', ') || 'None'}
        </Text>
      </Card>

      <Modal
        opened={isOpen}
        onClose={handleCancel}
        title="Filter report"
        size="md"
      >
        <Text size="sm" fw={500} mb="sm">
          Metrics
        </Text>
        <ScrollArea h={350} mb="md">
          <Checkbox.Group
            data-testid="listbox-metrics"
            value={modalSelected}
            onChange={setModalSelected}
          >
            <Stack gap="xs">
              {metrics.map((opt) => (
                <Checkbox key={opt} value={opt} label={opt} />
              ))}
            </Stack>
          </Checkbox.Group>
        </ScrollArea>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply filters</Button>
        </Group>
      </Modal>
    </>
  );
}
