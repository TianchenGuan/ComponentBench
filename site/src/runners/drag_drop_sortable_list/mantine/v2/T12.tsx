'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-v2-T12
 * Task Name: Mantine: High-contrast escalation table exact reorder
 *
 * Setup Description:
 * Layout is table_cell in high_contrast theme with compact spacing, small scale, and medium clutter.
 * The compact card title is "On-call escalation".
 *
 * The table rows are draggable only from a small grip icon in the first column. Initial order is:
 * Alice Chen, Bruno Silva, Chloe Park, Diego Ruiz, Evelyn Patel.
 *
 * Other columns show role text and a disabled active toggle. The footer contains "Cancel" and "Apply".
 * A small dropdown for escalation delay and a tooltip icon sit above the table but are irrelevant.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Chloe Park, Alice Chen, Evelyn Patel, Bruno Silva, Diego Ruiz.
 * Changes must be committed by activating 'Apply'.
 * Task ends when the order predicate holds.
 *
 * Theme: high_contrast, Spacing: compact, Layout: table_cell, Placement: top_right, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button, Table, Select, Switch, Tooltip } from '@mantine/core';
import { IconGripVertical, IconInfoCircle } from '@tabler/icons-react';
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
import type { TaskComponentProps } from '../../types';
import { arraysEqual } from '../../types';

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

const hc = {
  bg: '#0a0a0a',
  surface: '#141414',
  border: '#f5f500',
  text: '#ffffff',
  muted: '#bdbdbd',
};

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
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: isDragging ? '#1f1f1f' : 'transparent',
  };

  return (
    <Table.Tr ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <Table.Td style={{ width: 30, padding: '4px 8px' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <IconGripVertical size={12} style={{ color: hc.border }} />
        </div>
      </Table.Td>
      <Table.Td style={{ padding: '4px 8px', fontSize: 12, color: hc.text }}>{item.name}</Table.Td>
      <Table.Td style={{ padding: '4px 8px', fontSize: 12, color: hc.muted }}>{item.role}</Table.Td>
      <Table.Td style={{ padding: '4px 8px' }}>
        <Switch size="xs" checked={item.active} disabled styles={{ track: { borderColor: hc.border } }} />
      </Table.Td>
    </Table.Tr>
  );
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<EscalationItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<EscalationItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map((item) => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleApply = () => {
    setCommittedItems([...items]);
  };

  const handleCancel = () => {
    setItems([...committedItems]);
  };

  return (
    <Paper
      shadow="md"
      p="sm"
      withBorder
      style={{ width: 360, background: hc.surface, borderColor: hc.border, borderWidth: 2 }}
      data-testid="escalation-card"
    >
      <Group justify="space-between" mb="xs">
        <Title order={5} size="sm" c={hc.text}>
          On-call escalation
        </Title>
        <Tooltip label="Escalation policy info" withArrow>
          <IconInfoCircle size={14} style={{ color: hc.border, cursor: 'default' }} />
        </Tooltip>
      </Group>

      <Select
        label="Escalation delay"
        size="xs"
        data={['5 minutes', '10 minutes', '15 minutes', '30 minutes']}
        defaultValue="10 minutes"
        mb="sm"
        styles={{
          input: { fontSize: 12, background: hc.bg, color: hc.text, borderColor: hc.muted },
          label: { color: hc.muted },
        }}
      />

      <Text fw={600} size="xs" mb="xs" c={hc.text}>
        Escalation order
      </Text>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Table
            withTableBorder
            withColumnBorders
            data-testid="sortable-list-escalation-order"
            styles={{
              table: { background: hc.bg },
              th: { color: hc.text, borderColor: hc.border },
              td: { borderColor: hc.muted },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 30, padding: '4px 8px' }} />
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
        <Button variant="default" size="xs" onClick={handleCancel} styles={{ root: { borderColor: hc.border, color: hc.text } }}>
          Cancel
        </Button>
        <Button size="xs" onClick={handleApply} data-testid="apply-escalation-order" styles={{ root: { background: hc.border, color: '#000' } }}>
          Apply
        </Button>
      </Group>
    </Paper>
  );
}
