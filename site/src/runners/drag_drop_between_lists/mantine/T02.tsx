'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T02
 * Task Name: Pin a shortcut inside a dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Group, Stack, Card, SimpleGrid } from '@mantine/core';
import { IconGripVertical, IconHome, IconFileInvoice, IconUsers, IconChartBar, IconActivity } from '@tabler/icons-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, DraggableItem, ContainerState } from '../types';
import { checkSetMembership } from '../types';

const initialContainers: ContainerState = {
  available: [
    { id: 'invoices', label: 'Invoices' },
    { id: 'customers', label: 'Customers' },
    { id: 'reports', label: 'Reports' },
  ],
  pinned: [{ id: 'overview', label: 'Overview' }],
};

const targetState = {
  'Available shortcuts': ['Customers', 'Reports'],
  'Pinned shortcuts': ['Overview', 'Invoices'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: 4,
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <IconGripVertical size={12} color="#adb5bd" />
      <Text size="xs">{item.label}</Text>
    </Box>
  );
}

function DroppableContainer({ id, title, items, isOver }: { id: string; title: string; items: DraggableItem[]; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 100,
        padding: 8,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text fw={600} size="xs" mb={6}>{title}</Text>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 60 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const mappedContainers = {
      'Available shortcuts': containers.available,
      'Pinned shortcuts': containers.pinned,
    };
    if (checkSetMembership(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId(over?.id as string || null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    setContainers(prev => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex(item => item.id === active.id);
      const activeItem = activeItems[activeIndex];
      activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex(item => item.id === over.id);
      if (overIndex === -1) overItems.push(activeItem);
      else overItems.splice(overIndex, 0, activeItem);
      return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
    });
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Box style={{ display: 'flex', gap: 16 }}>
      <Paper shadow="xs" p="sm" style={{ width: 160 }}>
        <Stack gap={4}>
          <Group gap={8}><IconHome size={14} /><Text size="xs">Dashboard</Text></Group>
          <Group gap={8}><IconFileInvoice size={14} /><Text size="xs">Invoices</Text></Group>
          <Group gap={8}><IconUsers size={14} /><Text size="xs">Customers</Text></Group>
          <Group gap={8}><IconChartBar size={14} /><Text size="xs">Reports</Text></Group>
        </Stack>
      </Paper>

      <Box style={{ flex: 1 }}>
        <SimpleGrid cols={3} spacing="sm" mb="sm">
          <Card padding="sm" shadow="xs"><Text size="xs" c="dimmed">Revenue</Text><Text fw={600}>$12,345</Text></Card>
          <Card padding="sm" shadow="xs"><Text size="xs" c="dimmed">Orders</Text><Text fw={600}>234</Text></Card>
          <Card padding="sm" shadow="xs"><Text size="xs" c="dimmed">Visitors</Text><Text fw={600}>5,678</Text></Card>
        </SimpleGrid>

        <Group align="flex-start" gap="sm">
          <Paper shadow="sm" p="sm" style={{ width: 280 }} data-testid="pinned-shortcuts-widget">
            <Text fw={600} size="sm" mb="sm">Pinned shortcuts</Text>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
              <Box style={{ display: 'flex', gap: 8 }}>
                <DroppableContainer id="available" title="Available shortcuts" items={containers.available} isOver={overId === 'available'} />
                <DroppableContainer id="pinned" title="Pinned shortcuts" items={containers.pinned} isOver={overId === 'pinned'} />
              </Box>
              <DragOverlay>
                {activeItem ? (
                  <Box style={{ padding: '8px 12px', backgroundColor: '#fff', border: '1px solid #228be6', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <IconGripVertical size={12} color="#adb5bd" />
                    <Text size="xs">{activeItem.label}</Text>
                  </Box>
                ) : null}
              </DragOverlay>
            </DndContext>
          </Paper>

          <Paper shadow="xs" p="sm" style={{ flex: 1 }}>
            <Text size="xs" fw={600} mb="xs">Recent Activity</Text>
            <Stack gap={4}>
              <Group gap={8}><IconActivity size={12} /><Text size="xs">Order #123 placed</Text></Group>
              <Group gap={8}><IconActivity size={12} /><Text size="xs">New customer signup</Text></Group>
            </Stack>
          </Paper>
        </Group>
      </Box>
    </Box>
  );
}
