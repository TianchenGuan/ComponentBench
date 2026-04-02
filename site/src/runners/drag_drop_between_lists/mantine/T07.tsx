'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T07
 * Task Name: Allow a protocol in dark theme
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box } from '@mantine/core';
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
  blocked: [
    { id: 'ssl-30', label: 'SSL 3.0' },
    { id: 'tls-10', label: 'TLS 1.0' },
    { id: 'tls-11', label: 'TLS 1.1' },
    { id: 'tls-13', label: 'TLS 1.3' },
  ],
  allowed: [{ id: 'tls-12', label: 'TLS 1.2' }],
};

const targetState = {
  'Blocked protocols': ['SSL 3.0', 'TLS 1.0', 'TLS 1.1'],
  'Allowed protocols': ['TLS 1.2', 'TLS 1.3'],
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
        padding: '10px 14px',
        backgroundColor: '#2c2c2c',
        border: '1px solid #404040',
        borderRadius: 6,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <IconGripVertical size={14} color="#666" />
      <Text size="sm" c="gray.2">{item.label}</Text>
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
        minWidth: 150,
        padding: 12,
        backgroundColor: isOver ? '#1a3a4a' : '#1f1f1f',
        borderRadius: 8,
        border: `2px dashed ${isOver ? '#228be6' : '#404040'}`,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Text fw={600} size="sm" c="gray.3" mb={8}>{title}</Text>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 120 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
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
      'Blocked protocols': containers.blocked,
      'Allowed protocols': containers.allowed,
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
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      style={{ width: 440, backgroundColor: '#1f1f1f', border: '1px solid #333' }}
      data-testid="security-protocols-card"
    >
      <Text fw={600} size="lg" c="gray.1" mb="md">Security Protocols</Text>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box style={{ display: 'flex', gap: 16 }}>
          <DroppableContainer id="blocked" title="Blocked protocols" items={containers.blocked} isOver={overId === 'blocked'} />
          <DroppableContainer id="allowed" title="Allowed protocols" items={containers.allowed} isOver={overId === 'allowed'} />
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Box
              style={{
                padding: '10px 14px',
                backgroundColor: '#2c2c2c',
                border: '1px solid #228be6',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <IconGripVertical size={14} color="#666" />
              <Text size="sm" c="gray.2">{activeItem.label}</Text>
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
