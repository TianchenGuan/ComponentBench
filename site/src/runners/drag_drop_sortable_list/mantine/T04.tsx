'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T04
 * Task Name: Mantine: Reorder primary badges (two lists)
 *
 * Setup Description:
 * Layout is a **form section** titled **Status badge configuration** with two sortable lists (instances=2).
 *
 * List 1 (target):
 * - **Primary status badges**
 * - Initial order (top → bottom): New, In progress, Blocked, Done
 *
 * List 2 (non-target):
 * - **Secondary status badges**
 * - Initial order (top → bottom): Archived, Muted, Spam
 *
 * Each list row is rendered as a Mantine Group with:
 * - left grip icon handle,
 * - badge label,
 * - a tiny color swatch on the right (not interactive).
 *
 * Distractors (clutter=low):
 * - A text input labeled "Preview label" above the lists (not required).
 * - A disabled toggle "Show icons" below (not required).
 *
 * Behavior:
 * - Reordering is immediate within each list.
 * - Dragging across lists is disabled.
 * - No Save/Apply.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: New, In progress, Done, Blocked.
 * Only the list labeled 'Primary status badges' counts toward success.
 *
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, TextInput, Switch, Grid, ColorSwatch } from '@mantine/core';
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

interface BadgeItem {
  id: string;
  label: string;
  color: string;
}

const initialPrimaryItems: BadgeItem[] = [
  { id: 'new', label: 'New', color: '#1677ff' },
  { id: 'in-progress', label: 'In progress', color: '#faad14' },
  { id: 'blocked', label: 'Blocked', color: '#ff4d4f' },
  { id: 'done', label: 'Done', color: '#52c41a' },
];

const initialSecondaryItems: BadgeItem[] = [
  { id: 'archived', label: 'Archived', color: '#8c8c8c' },
  { id: 'muted', label: 'Muted', color: '#bfbfbf' },
  { id: 'spam', label: 'Spam', color: '#595959' },
];

const targetOrder = ['new', 'in-progress', 'done', 'blocked'];

function SortableRow({ item }: { item: BadgeItem }) {
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
          <Text size="sm">{item.label}</Text>
        </Group>
        <ColorSwatch color={item.color} size={16} />
      </Group>
    </div>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryItems, setPrimaryItems] = useState<BadgeItem[]>(initialPrimaryItems);
  const [secondaryItems, setSecondaryItems] = useState<BadgeItem[]>(initialSecondaryItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = primaryItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [primaryItems, onSuccess]);

  const handlePrimaryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPrimaryItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSecondaryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSecondaryItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 500 }} data-testid="badge-config-form">
      <Title order={4} mb="md">Status badge configuration</Title>

      <TextInput
        label="Preview label"
        placeholder="Enter label"
        mb="md"
      />

      <Grid gutter="md">
        <Grid.Col span={6}>
          <Text fw={500} size="sm" mb="xs">Primary status badges</Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handlePrimaryDragEnd}
          >
            <SortableContext items={primaryItems} strategy={verticalListSortingStrategy}>
              <div
                data-testid="sortable-list-primary"
                aria-label="Primary status badges"
                style={{ border: '1px solid #e9ecef', borderRadius: 4 }}
              >
                {primaryItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={500} size="sm" mb="xs" c="dimmed">Secondary status badges</Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSecondaryDragEnd}
          >
            <SortableContext items={secondaryItems} strategy={verticalListSortingStrategy}>
              <div
                data-testid="sortable-list-secondary"
                aria-label="Secondary status badges"
                style={{ border: '1px solid #e9ecef', borderRadius: 4, opacity: 0.7 }}
              >
                {secondaryItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Grid.Col>
      </Grid>

      <Switch label="Show icons" disabled mt="md" />
    </Paper>
  );
}
