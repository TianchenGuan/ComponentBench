'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T03
 * Task Name: Match VIP customers to a small reference card
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Avatar, Badge, Group } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
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
  all: [
    { id: 'jamie-ortega', label: 'Jamie Ortega' },
    { id: 'morgan-li', label: 'Morgan Li' },
  ],
  vip: [{ id: 'alex-kim', label: 'Alex Kim' }],
};

const targetState = {
  'All customers': ['Morgan Li'],
  'VIP customers': ['Alex Kim', 'Jamie Ortega'],
};

const previewCustomers = ['Alex Kim', 'Jamie Ortega'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '8px 10px',
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: 6,
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
      <Avatar size="xs" radius="xl" color="blue">{getInitials(item.label)}</Avatar>
      <Text size="xs" style={{ flex: 1 }}>{item.label}</Text>
      <IconGripVertical size={12} color="#adb5bd" />
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
        minWidth: 130,
        padding: 10,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text fw={600} size="xs" mb={6}>{title}</Text>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 80 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
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
      'All customers': containers.all,
      'VIP customers': containers.vip,
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
    <Paper shadow="sm" p="md" radius="md" style={{ width: 400 }} data-testid="vip-customers-card">
      <Text fw={600} size="md" mb="sm">VIP Customers</Text>
      
      <Group align="flex-start" gap="sm">
        <Box style={{ flex: 1 }}>
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <Box style={{ display: 'flex', gap: 10 }}>
              <DroppableContainer id="all" title="All customers" items={containers.all} isOver={overId === 'all'} />
              <DroppableContainer id="vip" title="VIP customers" items={containers.vip} isOver={overId === 'vip'} />
            </Box>
            <DragOverlay>
              {activeItem ? (
                <Box style={{ padding: '8px 10px', backgroundColor: '#fff', border: '1px solid #228be6', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <Avatar size="xs" radius="xl" color="blue">{getInitials(activeItem.label)}</Avatar>
                  <Text size="xs">{activeItem.label}</Text>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>

        <Box style={{ width: 100, padding: 8, backgroundColor: '#ebfbee', borderRadius: 6, border: '1px solid #b2f2bb' }} data-testid="vip-preview">
          <Text size="xs" fw={600} c="green" mb={4}>VIP Preview</Text>
          {previewCustomers.map(c => (
            <Badge key={c} size="xs" color="green" variant="light" mb={2} fullWidth>{c}</Badge>
          ))}
          <Text size="xs" c="dimmed" mt={4}>Match VIP customers to the preview</Text>
        </Box>
      </Group>
    </Paper>
  );
}
