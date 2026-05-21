'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T02
 * Task Name: Mantine: Place 'Review' above 'In progress'
 *
 * Setup Description:
 * Centered isolated card titled **Kanban stages** contains one sortable list with 4 items.
 *
 * Initial order (top → bottom):
 * Backlog, In progress, Review, Done.
 *
 * Row structure:
 * - Left drag handle icon (grip)
 * - Stage label text
 * - Right side shows a small count pill (e.g., number of cards) — decorative only.
 *
 * Behavior:
 * - Reorders immediately on drop.
 * - No Save/Apply.
 * - No scrolling and no other page elements.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Backlog, Review, In progress, Done.
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

interface StageItem {
  id: string;
  label: string;
  count: number;
}

const initialItems: StageItem[] = [
  { id: 'backlog', label: 'Backlog', count: 8 },
  { id: 'in-progress', label: 'In progress', count: 3 },
  { id: 'review', label: 'Review', count: 2 },
  { id: 'done', label: 'Done', count: 12 },
];

const targetOrder = ['backlog', 'review', 'in-progress', 'done'];

function SortableRow({ item }: { item: StageItem }) {
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
        <Badge color="gray" variant="light" size="sm" circle>{item.count}</Badge>
      </Group>
    </div>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<StageItem[]>(initialItems);
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
    <Paper shadow="sm" p="md" withBorder style={{ width: 350 }} data-testid="sortable-list-kanban-stages">
      <Title order={4} mb="md">Kanban stages</Title>
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
