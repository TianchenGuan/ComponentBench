'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-v2-T16
 * Task Name: Mantine: Inline audit navigation exact relative reorder
 *
 * Setup Description:
 * Layout is inline_surface with compact spacing and medium clutter. The target list sits inside a dense admin settings section
 * between a permissions table and a read-only summary panel.
 *
 * The sortable list "Audit navigation" has initial order:
 * Overview, Sessions, Audit log, Access control, API keys, Retention.
 * Rows are handle-only and compact. The section footer contains "Save navigation".
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Overview, Sessions, Access control, Audit log, API keys, Retention.
 * Changes must be committed by activating 'Save navigation'.
 * Task ends when the order predicate holds.
 *
 * Theme: light, Spacing: compact, Layout: inline_surface, Placement: off_center, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button, Table, Box } from '@mantine/core';
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
import type { TaskComponentProps } from '../../types';
import { arraysEqual } from '../../types';

interface NavItem {
  id: string;
  label: string;
}

const initialItems: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'audit-log', label: 'Audit log' },
  { id: 'access-control', label: 'Access control' },
  { id: 'api-keys', label: 'API keys' },
  { id: 'retention', label: 'Retention' },
];

const targetOrder = ['overview', 'sessions', 'access-control', 'audit-log', 'api-keys', 'retention'];

function SortableRow({ item }: { item: NavItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: isDragging ? '#f8f9fa' : 'transparent',
    padding: '6px 8px',
    borderBottom: '1px solid #e9ecef',
  };

  return (
    <div ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <Group gap="xs">
        <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex' }}>
          <IconGripVertical size={14} style={{ color: '#adb5bd' }} />
        </span>
        <Text size="xs">{item.label}</Text>
      </Group>
    </div>
  );
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<NavItem[]>(initialItems);
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

  return (
    <Box p="md" data-testid="inline-audit-admin">
      <Group align="flex-start" gap="md" wrap="wrap">
        <Paper withBorder p="xs" style={{ flex: '0 1 220px' }}>
          <Text fw={600} size="xs" mb={6}>
            Role permissions
          </Text>
          <Table withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ fontSize: 10 }}>Role</Table.Th>
                <Table.Th style={{ fontSize: 10 }}>Read</Table.Th>
                <Table.Th style={{ fontSize: 10 }}>Write</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {['Admin', 'Auditor', 'Viewer'].map((r) => (
                <Table.Tr key={r}>
                  <Table.Td style={{ fontSize: 10 }}>{r}</Table.Td>
                  <Table.Td style={{ fontSize: 10 }}>Yes</Table.Td>
                  <Table.Td style={{ fontSize: 10 }}>{r === 'Viewer' ? 'No' : 'Yes'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Paper withBorder p="sm" style={{ flex: '0 1 240px' }} data-testid="audit-navigation-section">
          <Title order={6} size="sm" mb="xs">
            Audit navigation
          </Title>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div data-testid="sortable-list-audit-navigation" style={{ border: '1px solid #e9ecef', borderRadius: 4 }}>
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Group justify="flex-end" mt="sm">
            <Button size="xs" onClick={() => setCommittedItems([...items])} data-testid="save-navigation">
              Save navigation
            </Button>
          </Group>
        </Paper>

        <Paper withBorder p="xs" bg="gray.0" style={{ flex: '0 1 180px' }}>
          <Text fw={600} size="xs" mb={6}>
            Compliance summary
          </Text>
          <Text size="xs" c="dimmed">
            Last export: 2024-09-12. Retention policy v3 active. No blocking findings.
          </Text>
        </Paper>
      </Group>
    </Box>
  );
}
