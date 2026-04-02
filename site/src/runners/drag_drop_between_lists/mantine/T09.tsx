'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T09
 * Task Name: Scroll a long engineer list to add someone on-call
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Avatar } from '@mantine/core';
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

const engineersList = [
  'Aiden Ross', 'Ben Patel', 'Chris Johnson', 'Dana Kim', 'Eli Nguyen',
  'Fatima Ali', 'Grace Liu', 'Hiro Tanaka', 'Ivy Brooks', 'Leo Garcia',
  'Mina Hassan', 'Zoe Martinez'
];

const initialContainers: ContainerState = {
  available: engineersList.map(e => ({ id: e.toLowerCase().replace(/\s+/g, '-'), label: e })),
  oncall: [{ id: 'ava-chen', label: 'Ava Chen' }],
};

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
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: 6,
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <Avatar size="xs" radius="xl" color="blue">{getInitials(item.label)}</Avatar>
      <Text size="sm" style={{ flex: 1 }}>{item.label}</Text>
      <IconGripVertical size={14} color="#adb5bd" />
    </Box>
  );
}

function DroppableContainer({ id, title, items, isOver, scrollable }: { id: string; title: string; items: DraggableItem[]; isOver: boolean; scrollable?: boolean }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 180,
        padding: 12,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 8,
        border: `2px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text fw={600} size="sm" mb={8}>{title}</Text>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 100, maxHeight: scrollable ? 240 : undefined, overflowY: scrollable ? 'auto' : undefined }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
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
    const oncallLabels = containers.oncall.map(i => i.label);
    if (oncallLabels.includes('Ava Chen') && oncallLabels.includes('Zoe Martinez')) {
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
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 480 }} data-testid="oncall-rotation-card">
      <Text fw={600} size="lg" mb="md">On-call Rotation</Text>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box style={{ display: 'flex', gap: 16 }}>
          <DroppableContainer id="available" title="Available engineers" items={containers.available} isOver={overId === 'available'} scrollable />
          <DroppableContainer id="oncall" title="On-call this week" items={containers.oncall} isOver={overId === 'oncall'} />
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Box
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff',
                border: '1px solid #228be6',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Avatar size="xs" radius="xl" color="blue">{getInitials(activeItem.label)}</Avatar>
              <Text size="sm">{activeItem.label}</Text>
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
