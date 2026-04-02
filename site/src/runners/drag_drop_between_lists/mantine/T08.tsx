'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T08
 * Task Name: Connect an integration with small-scale controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, ThemeIcon } from '@mantine/core';
import { IconGripVertical, IconBrandGithub, IconBrandSlack, IconBolt, IconBrandTrello } from '@tabler/icons-react';
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

interface IntegrationItem extends DraggableItem {
  icon: React.ReactNode;
}

const initialContainers: { available: IntegrationItem[]; connected: IntegrationItem[] } = {
  available: [
    { id: 'slack', label: 'Slack', icon: <IconBrandSlack size={12} /> },
    { id: 'jira', label: 'Jira', icon: <IconBrandTrello size={12} /> },
    { id: 'zapier', label: 'Zapier', icon: <IconBolt size={12} /> },
  ],
  connected: [
    { id: 'github', label: 'GitHub', icon: <IconBrandGithub size={12} /> },
  ],
};

const targetState = {
  'Available integrations': ['Jira', 'Zapier'],
  'Connected integrations': ['GitHub', 'Slack'],
};

function SortableItem({ item }: { item: IntegrationItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '6px 8px',
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: 4,
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
      {...attributes}
      data-testid={`dnd-item-${item.id}`}
    >
      <ThemeIcon size="xs" variant="light" color="gray">{item.icon}</ThemeIcon>
      <Text size="xs" style={{ flex: 1 }}>{item.label}</Text>
      <Box
        ref={setActivatorNodeRef}
        {...listeners}
        style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}
        data-testid={`dnd-handle-${item.id}`}
      >
        <IconGripVertical size={10} color="#adb5bd" />
      </Box>
    </Box>
  );
}

function DroppableContainer({ id, title, items, isOver }: { id: string; title: string; items: IntegrationItem[]; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 110,
        padding: 8,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 4,
        border: `1px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text fw={600} size="xs" mb={4}>{title}</Text>
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

export default function T08({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState(initialContainers);
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
      'Available integrations': containers.available,
      'Connected integrations': containers.connected,
    };
    if (checkSetMembership(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id === 'available' || id === 'connected') return id;
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
      const activeItems = [...prev[activeContainer as keyof typeof prev]];
      const overItems = [...prev[overContainer as keyof typeof prev]];
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
      const items = containers[activeContainer as keyof typeof containers];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer as keyof typeof prev], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? [...containers.available, ...containers.connected].find(item => item.id === activeId) : null;

  return (
    <Paper shadow="sm" p="sm" radius="md" style={{ width: 300 }} data-testid="integrations-card">
      <Text fw={600} size="sm" mb="sm">Integrations</Text>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box style={{ display: 'flex', gap: 8 }}>
          <DroppableContainer id="available" title="Available integrations" items={containers.available} isOver={overId === 'available'} />
          <DroppableContainer id="connected" title="Connected integrations" items={containers.connected} isOver={overId === 'connected'} />
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Box
              style={{
                padding: '6px 8px',
                backgroundColor: '#fff',
                border: '1px solid #228be6',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <ThemeIcon size="xs" variant="light" color="gray">{activeItem.icon}</ThemeIcon>
              <Text size="xs">{activeItem.label}</Text>
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
