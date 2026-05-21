'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T01
 * Task Name: Mantine: Move 'Messages' to top (pinned shortcuts)
 *
 * Setup Description:
 * A centered isolated card (Mantine Paper) titled **Pinned shortcuts** contains one vertical sortable list (instances=1).
 *
 * Initial order (top → bottom):
 * Home, Explore, Messages, Notifications, Profile.
 *
 * Each row is a Mantine Group with:
 * - a left grip icon (drag handle),
 * - the shortcut label text,
 * - a small gray badge on the right (e.g., 'NEW' for some items; non-interactive).
 *
 * Behavior:
 * - Dragging the row reorders items immediately on drop (no Save button).
 * - All items are visible; no scrolling.
 * - No other UI elements (clutter=none).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Messages, Home, Explore, Notifications, Profile.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Badge } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
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
import type { TaskComponentProps } from '../types';
import { arraysEqual } from '../types';

interface ShortcutItem {
  id: string;
  label: string;
  badge?: string;
}

const initialItems: ShortcutItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'explore', label: 'Explore', badge: 'NEW' },
  { id: 'messages', label: 'Messages' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'profile', label: 'Profile' },
];

const targetOrder = ['messages', 'home', 'explore', 'notifications', 'profile'];

function SortableRow({ item }: { item: ShortcutItem }) {
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
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`sortable-item-${item.id}`}
    >
      <Group justify="space-between">
        <Group gap="sm">
          <IconGripVertical size={16} style={{ color: '#adb5bd' }} />
          <Text>{item.label}</Text>
        </Group>
        {item.badge && <Badge color="gray" variant="light" size="sm">{item.badge}</Badge>}
      </Group>
    </div>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<ShortcutItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = items.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [items, onSuccess]);

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

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 400 }} data-testid="sortable-list-pinned-shortcuts">
      <Title order={4} mb="md">Pinned shortcuts</Title>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div data-testid="sortable-list" style={{ border: '1px solid #e9ecef', borderRadius: 4 }}>
            {items.map((item) => (
              <SortableRow key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Paper>
  );
}
