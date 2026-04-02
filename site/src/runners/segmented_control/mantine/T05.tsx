'use client';

/**
 * segmented_control-mantine-T05: Customize modal: Layout density → Compact + Save
 *
 * Layout: modal flow on a "Dashboard layout" page.
 * On the main page, a button labeled "Customize layout" opens a centered modal titled "Customize layout".
 *
 * Inside the modal:
 * - SegmentedControl "Layout density" with options: "Spacious", "Compact", "Condensed"
 *   Initial committed state: Spacious
 * - SegmentedControl "Sidebar" with options: "Show", "Hide"
 *   Initial state: Show
 *
 * Modal actions:
 * - "Cancel" closes without saving (reverts to committed state)
 * - "Save" commits changes
 *
 * Clutter (low): a short description paragraph and an illustration appear, but are not required.
 *
 * Success: The committed value of "Layout density" is Compact.
 * The change is committed by clicking "Save".
 */

import React, { useState } from 'react';
import { Card, Text, Button, Modal, Stack, Group, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const densityOptions = ['Spacious', 'Compact', 'Condensed'];
const sidebarOptions = ['Show', 'Hide'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [committedDensity, setCommittedDensity] = useState<string>('Spacious');
  const [committedSidebar, setCommittedSidebar] = useState<string>('Show');
  
  const [pendingDensity, setPendingDensity] = useState<string>('Spacious');
  const [pendingSidebar, setPendingSidebar] = useState<string>('Show');

  const openModal = () => {
    setPendingDensity(committedDensity);
    setPendingSidebar(committedSidebar);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleSave = () => {
    setCommittedDensity(pendingDensity);
    setCommittedSidebar(pendingSidebar);
    setModalOpen(false);
    
    if (pendingDensity === 'Compact') {
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, textAlign: 'center' }}>
        <Text fw={600} size="lg" mb="md">Dashboard layout</Text>
        <Button onClick={openModal}>Customize layout</Button>
        <Text size="sm" c="dimmed" mt="md">
          Current: {committedDensity} / Sidebar: {committedSidebar}
        </Text>
      </Card>

      <Modal opened={modalOpen} onClose={handleCancel} title="Customize layout" centered>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Adjust the layout settings to match your preferences. Changes will take effect after saving.
          </Text>

          <div>
            <Text fw={500} mb="xs">Layout density</Text>
            <SegmentedControl
              data-testid="layout-density"
              data-canonical-type="segmented_control"
              data-selected-value={pendingDensity}
              data={densityOptions}
              value={pendingDensity}
              onChange={setPendingDensity}
              fullWidth
            />
          </div>

          <div>
            <Text fw={500} mb="xs">Sidebar</Text>
            <SegmentedControl
              data-testid="sidebar"
              data-canonical-type="segmented_control"
              data-selected-value={pendingSidebar}
              data={sidebarOptions}
              value={pendingSidebar}
              onChange={setPendingSidebar}
            />
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
