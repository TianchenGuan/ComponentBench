'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T05
 * Task Name: Mantine: Reorder notification priority and save
 *
 * Setup Description:
 * Layout is a **settings panel** with a main pane titled **Notifications**.
 *
 * The main pane includes a card titled **Notification priority** containing:
 * - one sortable list of 4 notification categories (instances=1),
 * - a primary button **Save** at the bottom-right of the card,
 * - a subtle text "Unsaved changes" that appears after dragging.
 *
 * Initial order (top → bottom):
 * Product updates, Security alerts, Tips, Weekly summary.
 *
 * Dragging behavior:
 * - Handle-only dragging: the grip icon on the left is the activator.
 * - The list updates visually on drop, but changes are not committed until Save.
 *
 * Feedback:
 * - After clicking Save, a green notification "Saved" appears in the corner.
 *
 * Distractors (clutter=low):
 * - A checkbox "Email me weekly" above the list (not required).
 * - A link "Manage channels" under the list (not required).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Security alerts, Product updates, Tips, Weekly summary.
 * Changes must be committed by activating 'Save'.
 *
 * Theme: light, Spacing: comfortable, Layout: settings_panel, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button, Checkbox, Anchor, Notification, Box, NavLink } from '@mantine/core';
import { IconGripVertical, IconSettings, IconBell, IconLock, IconUser, IconCheck } from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, SortableItem } from '../types';
import { arraysEqual } from '../types';

const initialItems: SortableItem[] = [
  { id: 'product-updates', label: 'Product updates' },
  { id: 'security-alerts', label: 'Security alerts' },
  { id: 'tips', label: 'Tips' },
  { id: 'weekly-summary', label: 'Weekly summary' },
];

const targetOrder = ['security-alerts', 'product-updates', 'tips', 'weekly-summary'];

function SortableRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#f8f9fa' : 'transparent',
    padding: '10px 12px',
    borderBottom: '1px solid #e9ecef',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
    >
      <Group gap="sm">
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <IconGripVertical size={16} style={{ color: '#adb5bd' }} />
        </div>
        <Text size="sm">{item.label}</Text>
      </Group>
    </div>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const [showNotification, setShowNotification] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasUnsavedChanges = !arraysEqual(
    items.map(i => i.id),
    committedItems.map(i => i.id)
  );

  useEffect(() => {
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    setCommittedItems([...items]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const navItems = [
    { icon: IconUser, label: 'Profile' },
    { icon: IconBell, label: 'Notifications', active: true },
    { icon: IconLock, label: 'Security' },
    { icon: IconSettings, label: 'Settings' },
  ];

  return (
    <Box style={{ display: 'flex', minHeight: 450 }}>
      <Paper withBorder style={{ width: 180, borderRight: 'none' }} p="sm">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            leftSection={<item.icon size={16} />}
            active={item.active}
            variant="light"
          />
        ))}
      </Paper>

      <Paper withBorder style={{ flex: 1, maxWidth: 400 }} p="md">
        <Title order={4} mb="md">Notifications</Title>

        <Paper withBorder p="md" data-testid="notification-priority-card">
          <Text fw={500} size="sm" mb="sm">Notification priority</Text>

          <Checkbox label="Email me weekly" mb="md" />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div
                data-testid="sortable-list-notification-priority"
                style={{ border: '1px solid #e9ecef', borderRadius: 4 }}
              >
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {hasUnsavedChanges && (
            <Text size="xs" c="orange" mt="xs">Unsaved changes</Text>
          )}

          <Anchor size="xs" mt="sm">Manage channels</Anchor>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleSave}>Save</Button>
          </Group>
        </Paper>
      </Paper>

      {showNotification && (
        <Notification
          icon={<IconCheck size={18} />}
          color="green"
          title="Saved"
          onClose={() => setShowNotification(false)}
          style={{ position: 'fixed', top: 20, right: 20 }}
        >
          Your notification priority has been saved.
        </Notification>
      )}
    </Box>
  );
}
