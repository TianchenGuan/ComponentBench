'use client';

/**
 * tags_input-mantine-T07: Edit tags inside a drawer and Apply
 *
 * The page uses a **dark theme** and shows a dashboard header with an "Edit labels" button.
 *
 * Drawer flow:
 * - Clicking "Edit labels" opens a Mantine Drawer that slides in from the right.
 * - The drawer contains a Mantine TagsInput labeled "Tags".
 * - The drawer footer has two buttons: "Cancel" and a primary "Apply".
 *
 * Initial state:
 * - The TagsInput inside the drawer starts with one pill: "todo".
 *
 * Commit requirement:
 * - Edits are visible in the drawer immediately, but the change only counts after clicking **Apply**.
 * - Closing the drawer via Cancel or the close icon should not count.
 *
 * Clutter:
 * - The drawer also contains a read-only TextInput labeled "Owner" and a non-functional "Help" link (not required).
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): urgent, client.
 * The change is committed by clicking **Apply**.
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Drawer, TagsInput, TextInput, Anchor, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['todo']);
  const [pendingTags, setPendingTags] = useState<string[]>(['todo']);
  const hasSucceeded = useRef(false);

  const handleOpenDrawer = () => {
    setPendingTags([...tags]);
    setIsDrawerOpen(true);
  };

  const handleApply = () => {
    setTags(pendingTags);
    setIsDrawerOpen(false);
    
    const normalizedTags = pendingTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['urgent', 'client'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setPendingTags([...tags]);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Dashboard</Text>
        <Button onClick={handleOpenDrawer} data-testid="edit-labels-button">
          Edit labels
        </Button>
      </Card>

      <Drawer
        opened={isDrawerOpen}
        onClose={handleCancel}
        title="Edit labels"
        position="right"
        padding="lg"
        data-testid="labels-drawer"
      >
        <TextInput
          label="Owner"
          value="admin@example.com"
          readOnly
          mb="md"
        />

        <TagsInput
          label="Tags"
          placeholder="Add tags..."
          value={pendingTags}
          onChange={setPendingTags}
          mb="md"
          data-testid="drawer-tags-input"
        />

        <Anchor size="sm" c="dimmed" mb="xl">Help</Anchor>

        <Group mt="xl">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} data-testid="apply-button">
            Apply
          </Button>
        </Group>
      </Drawer>
    </>
  );
}
