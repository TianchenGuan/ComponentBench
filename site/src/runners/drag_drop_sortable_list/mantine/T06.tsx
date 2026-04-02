'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T06
 * Task Name: Mantine: Reset sidebar order to default
 *
 * Setup Description:
 * A centered isolated card titled **Sidebar order** contains:
 * - one sortable list with 4 items (instances=1),
 * - a secondary button labeled **Reset to default**,
 * - an informational hint text under the button: "Default order: Home, Projects, Calendar, Reports".
 *
 * Initial list order (top → bottom) is intentionally not the default:
 * Reports, Home, Calendar, Projects.
 *
 * Reset behavior (clear_reset):
 * - Clicking **Reset to default** opens a small confirmation modal titled "Reset order?"
 * - The modal buttons are **Reset** and **Cancel**
 * - Clicking **Reset** restores the list to the default order immediately.
 *
 * Drag handles are present, but dragging is not required for this task.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Home, Projects, Calendar, Reports.
 * Changes must be committed by activating 'Reset'.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button, Modal } from '@mantine/core';
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
import type { TaskComponentProps, SortableItem } from '../types';
import { arraysEqual } from '../types';

const defaultItems: SortableItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'reports', label: 'Reports' },
];

// Initial order is NOT the default (intentionally out of order)
const initialItems: SortableItem[] = [
  { id: 'reports', label: 'Reports' },
  { id: 'home', label: 'Home' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'projects', label: 'Projects' },
];

const targetOrder = ['home', 'projects', 'calendar', 'reports'];

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
        <Text>{item.label}</Text>
      </Group>
    </div>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleReset = () => {
    setItems([...defaultItems]);
    setCommittedItems([...defaultItems]);
    setModalOpen(false);
  };

  return (
    <>
      <Paper shadow="sm" p="md" withBorder style={{ width: 400 }} data-testid="sortable-list-sidebar-order">
        <Title order={4} mb="md">Sidebar order</Title>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div data-testid="sortable-list" style={{ border: '1px solid #e9ecef', borderRadius: 4, marginBottom: 16 }}>
              {items.map((item) => (
                <SortableRow key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button variant="default" onClick={() => setModalOpen(true)}>Reset to default</Button>
        <Text size="xs" c="dimmed" mt="xs">
          Default order: Home, Projects, Calendar, Reports
        </Text>
      </Paper>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Reset order?" centered>
        <Text size="sm" mb="md">
          This will restore the sidebar order to the default configuration.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleReset}>Reset</Button>
        </Group>
      </Modal>
    </>
  );
}
