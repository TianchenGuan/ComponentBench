'use client';

/**
 * select_custom_multi-mantine-T09: Edit Segments in a drawer and save
 *
 * Scene context: theme=light, spacing=comfortable, layout=drawer_flow, placement=center, scale=default, instances=1, guidance=text, clutter=medium.
 * Layout: drawer flow. The base page shows a "Segments" card with a button labeled "Edit segments".
 * Clicking "Edit segments" opens a left-side drawer titled "Edit segments".
 * Inside the drawer is one Mantine MultiSelect labeled "Segments" (TARGET component).
 * Options (10): New users, Returning users, High value, Churn risk, Trial, Paid, Enterprise, SMB, EU, US.
 * Initial state in the drawer: selected pills are Trial and EU.
 * The drawer footer has two buttons: "Cancel" and a primary "Save segments".
 * Selecting/deselecting pills updates immediately inside the drawer, but the underlying saved state only updates after clicking Save segments.
 *
 * Success: The selected values are exactly: Paid, Enterprise, US (order does not matter). Changes must be committed by clicking 'Save segments'.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, MultiSelect, Button, Drawer, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const segmentOptions = [
  'New users', 'Returning users', 'High value', 'Churn risk', 'Trial',
  'Paid', 'Enterprise', 'SMB', 'EU', 'US'
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Trial', 'EU']);
  const [savedSelection, setSavedSelection] = useState<string[]>(['Trial', 'EU']);
  const successTriggered = useRef(false);

  const handleSave = () => {
    setSavedSelection([...selected]);
    setIsDrawerOpen(false);

    // Check success after save
    const targetSet = new Set(['Paid', 'Enterprise', 'US']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!successTriggered.current) {
        successTriggered.current = true;
        onSuccess();
      }
    }
  };

  const handleCancel = () => {
    setSelected([...savedSelection]); // Reset to saved state
    setIsDrawerOpen(false);
  };

  const handleOpen = () => {
    setSelected([...savedSelection]); // Start with saved state
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, textAlign: 'center' }}>
        <Text fw={600} size="lg" mb="md">Segments</Text>
        <Button onClick={handleOpen}>Edit segments</Button>
      </Card>

      <Drawer
        opened={isDrawerOpen}
        onClose={handleCancel}
        title="Edit segments"
        position="left"
        padding="lg"
      >
        <Stack gap="lg">
          <MultiSelect
            data-testid="segments-select"
            label="Segments"
            placeholder="Select segments"
            data={segmentOptions}
            value={selected}
            onChange={setSelected}
          />
          
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save segments</Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
