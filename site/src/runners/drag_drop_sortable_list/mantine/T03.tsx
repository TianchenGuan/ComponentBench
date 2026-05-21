'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T03
 * Task Name: Mantine: Make 'High' first (alert priority)
 *
 * Setup Description:
 * The page shows one centered card titled **Alert priority** with a sortable list of 4 priority levels.
 *
 * Initial order (top → bottom):
 * Low, Urgent, Medium, High.
 *
 * Each row includes:
 * - a left drag handle (grip icon),
 * - label text,
 * - a colored dot to the left of the label (visual only).
 *
 * Behavior:
 * - Immediate reorder on drop.
 * - No additional controls, no scrolling.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: High, Low, Urgent, Medium.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, ColorSwatch } from '@mantine/core';
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

interface PriorityItem {
  id: string;
  label: string;
  color: string;
}

const initialItems: PriorityItem[] = [
  { id: 'low', label: 'Low', color: '#52c41a' },
  { id: 'urgent', label: 'Urgent', color: '#ff4d4f' },
  { id: 'medium', label: 'Medium', color: '#faad14' },
  { id: 'high', label: 'High', color: '#fa8c16' },
];

const targetOrder = ['high', 'low', 'urgent', 'medium'];

function SortableRow({ item }: { item: PriorityItem }) {
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
      <Group gap="sm">
        <IconGripVertical size={16} style={{ color: '#adb5bd' }} />
        <ColorSwatch color={item.color} size={12} />
        <Text>{item.label}</Text>
      </Group>
    </div>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<PriorityItem[]>(initialItems);
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
    <Paper shadow="sm" p="md" withBorder style={{ width: 350 }} data-testid="sortable-list-alert-priority">
      <Title order={4} mb="md">Alert priority</Title>
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
