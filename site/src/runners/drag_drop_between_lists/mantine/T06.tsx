'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T06
 * Task Name: Customize columns in a drawer and apply
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Button, Group, Chip } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';
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
  visible: [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
  ],
  hidden: [
    { id: 'notes', label: 'Notes' },
    { id: 'tags', label: 'Tags' },
  ],
};

const targetState = {
  'Visible columns': ['Name', 'Status', 'Notes'],
  'Hidden columns': ['Tags'],
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
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
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
      <IconGripVertical size={14} color="#adb5bd" />
      <Text size="sm">{item.label}</Text>
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
        minWidth: 140,
        padding: 12,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `2px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text fw={600} size="sm" mb={8}>{title}</Text>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 100 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committedContainers, setCommittedContainers] = useState<ContainerState>(initialContainers);
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
      'Visible columns': committedContainers.visible,
      'Hidden columns': committedContainers.hidden,
    };
    if (checkSetMembership(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedContainers, onSuccess]);

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
      if (activeIndex === -1) return prev;
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

  const handleApply = () => {
    setCommittedContainers({ visible: [...containers.visible], hidden: [...containers.hidden] });
    setPanelOpen(false);
  };

  const handleCancel = () => {
    setContainers({ visible: [...committedContainers.visible], hidden: [...committedContainers.hidden] });
    setPanelOpen(false);
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Box style={{ display: 'flex', width: '100%', position: 'relative' }}>
      <Box style={{ width: 300, flexShrink: 0 }}>
        <Paper shadow="xs" p="md">
          <Group justify="space-between" align="center">
            <Box>
              <Text fw={600} size="sm">Table settings</Text>
              <Group gap={4} mt={4}>
                {committedContainers.visible.map(c => (
                  <Chip key={c.id} size="xs" checked={false}>{c.label}</Chip>
                ))}
              </Group>
            </Box>
            <Button variant="outline" size="xs" onClick={() => setPanelOpen(true)} data-testid="customize-columns-button">
              Customize columns
            </Button>
          </Group>
        </Paper>
      </Box>

      {panelOpen && (
        <Paper
          shadow="lg"
          p="md"
          radius="md"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 380,
            zIndex: 100,
            border: '1px solid #dee2e6',
            backgroundColor: '#fff',
          }}
        >
          <Group justify="space-between" mb="md">
            <Text fw={600} size="md">Customize columns</Text>
            <Button variant="subtle" size="xs" onClick={handleCancel} p={4}>
              <IconX size={16} />
            </Button>
          </Group>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box style={{ display: 'flex', gap: 12 }}>
              <DroppableContainer id="visible" title="Visible columns" items={containers.visible} isOver={overId === 'visible'} />
              <DroppableContainer id="hidden" title="Hidden columns" items={containers.hidden} isOver={overId === 'hidden'} />
            </Box>
            <DragOverlay>
              {activeItem ? (
                <Box style={{ padding: '10px 14px', backgroundColor: '#fff', border: '1px solid #228be6', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <IconGripVertical size={14} color="#adb5bd" />
                  <Text size="sm">{activeItem.label}</Text>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleApply} data-testid="apply-button">Apply</Button>
          </Group>
        </Paper>
      )}
    </Box>
  );
}
