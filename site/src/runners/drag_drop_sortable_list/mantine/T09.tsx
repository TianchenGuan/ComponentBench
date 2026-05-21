'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T09
 * Task Name: Mantine: Reorder table rows (escalation) and apply
 *
 * Setup Description:
 * Scene resembles a **table cell** editor for incident settings (layout=table_cell).
 *
 * A compact card titled **On-call escalation** contains a table labeled **Escalation order**:
 * - Each row is draggable via a small grip icon in the first column (handle-only).
 * - Columns: Drag handle | Name | Role (text) | Active (toggle, disabled).
 *
 * Initial row order (top → bottom):
 * Alice Chen, Bruno Silva, Chloe Park, Diego Ruiz, Evelyn Patel.
 *
 * Commit behavior:
 * - Row order changes are staged until **Apply** is clicked.
 * - Footer has **Cancel** and **Apply** buttons.
 *
 * Distractors (clutter=medium):
 * - A small dropdown "Escalation delay" above the table (not required).
 * - A tooltip icon next to the header (not required).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Chloe Park, Alice Chen, Evelyn Patel, Bruno Silva, Diego Ruiz.
 * Changes must be committed by activating 'Apply'.
 *
 * Theme: light, Spacing: compact, Layout: table_cell, Placement: top_right, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button, Table, Select, Switch, Notification } from '@mantine/core';
import { IconGripVertical, IconInfoCircle, IconCheck } from '@tabler/icons-react';
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

interface EscalationItem {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

const initialItems: EscalationItem[] = [
  { id: 'alice', name: 'Alice Chen', role: 'Lead', active: true },
  { id: 'bruno', name: 'Bruno Silva', role: 'Engineer', active: true },
  { id: 'chloe', name: 'Chloe Park', role: 'Manager', active: true },
  { id: 'diego', name: 'Diego Ruiz', role: 'Engineer', active: false },
  { id: 'evelyn', name: 'Evelyn Patel', role: 'Engineer', active: true },
];

const targetOrder = ['chloe', 'alice', 'evelyn', 'bruno', 'diego'];

function SortableTableRow({ item }: { item: EscalationItem }) {
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
  };

  return (
    <Table.Tr ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <Table.Td style={{ width: 30, padding: '4px 8px' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <IconGripVertical size={12} style={{ color: '#adb5bd' }} />
        </div>
      </Table.Td>
      <Table.Td style={{ padding: '4px 8px', fontSize: 12 }}>{item.name}</Table.Td>
      <Table.Td style={{ padding: '4px 8px', fontSize: 12 }}>{item.role}</Table.Td>
      <Table.Td style={{ padding: '4px 8px' }}>
        <Switch size="xs" checked={item.active} disabled />
      </Table.Td>
    </Table.Tr>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<EscalationItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<EscalationItem[]>(initialItems);
  const [showNotification, setShowNotification] = useState(false);
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

  const handleApply = () => {
    setCommittedItems([...items]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCancel = () => {
    setItems([...committedItems]);
  };

  return (
    <>
      <Paper shadow="sm" p="sm" withBorder style={{ width: 340 }} data-testid="escalation-card">
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <Title order={5} size="sm">On-call escalation</Title>
            <IconInfoCircle size={14} style={{ color: '#adb5bd' }} />
          </Group>
        </Group>

        <Select
          label="Escalation delay"
          size="xs"
          data={['5 minutes', '10 minutes', '15 minutes', '30 minutes']}
          defaultValue="10 minutes"
          mb="sm"
          styles={{ input: { fontSize: 12 } }}
        />

        <Text fw={500} size="xs" mb="xs">Escalation order</Text>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Table withTableBorder withColumnBorders data-testid="sortable-list-escalation-order">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 30, padding: '4px 8px' }}></Table.Th>
                  <Table.Th style={{ padding: '4px 8px', fontSize: 11 }}>Name</Table.Th>
                  <Table.Th style={{ padding: '4px 8px', fontSize: 11 }}>Role</Table.Th>
                  <Table.Th style={{ padding: '4px 8px', fontSize: 11 }}>Active</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => (
                  <SortableTableRow key={item.id} item={item} />
                ))}
              </Table.Tbody>
            </Table>
          </SortableContext>
        </DndContext>

        <Group justify="flex-end" gap="xs" mt="sm">
          <Button variant="default" size="xs" onClick={handleCancel}>Cancel</Button>
          <Button size="xs" onClick={handleApply}>Apply</Button>
        </Group>
      </Paper>

      {showNotification && (
        <Notification
          icon={<IconCheck size={18} />}
          color="green"
          title="Applied"
          onClose={() => setShowNotification(false)}
          style={{ position: 'fixed', top: 20, right: 20 }}
        >
          Escalation order updated.
        </Notification>
      )}
    </>
  );
}
