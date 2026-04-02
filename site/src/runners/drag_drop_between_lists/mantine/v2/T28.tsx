'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-v2-T28
 * Task Name: Mantine: Quick actions preview match with local save
 */

import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Group, Paper, Text } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, DraggableItem, ContainerState } from '../../types';
import { checkExactOrder, getItemLabels, arraysEqual } from '../../types';

const initialContainers: ContainerState = {
  available: [
    { id: 'export', label: 'Export' },
    { id: 'compare', label: 'Compare' },
    { id: 'share', label: 'Share' },
    { id: 'archive', label: 'Archive' },
  ],
  pinned: [
    { id: 'open', label: 'Open' },
    { id: 'edit', label: 'Edit' },
  ],
};

const targetState = {
  'Pinned actions': ['Open', 'Share', 'Compare'],
};

const previewOrder = ['Open', 'Share', 'Compare'];

function SortableItem({ item, isDark }: { item: DraggableItem; isDark: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '6px 10px',
        backgroundColor: isDark ? '#25262b' : '#fff',
        border: `1px solid ${isDark ? '#373a40' : '#e9ecef'}`,
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
      <IconGripVertical size={12} color={isDark ? '#5c5f66' : '#adb5bd'} />
      <Text size="xs" c={isDark ? 'gray.2' : 'dark'}>
        {item.label}
      </Text>
    </Box>
  );
}

function DroppableContainer({
  id,
  title,
  items,
  isOver,
  isDark,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  isOver: boolean;
  isDark: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 120,
        padding: 8,
        backgroundColor: isOver ? (isDark ? '#1c2f45' : '#e7f5ff') : isDark ? '#1a1b1e' : '#f8f9fa',
        borderRadius: 6,
        border: `2px dashed ${isOver ? '#228be6' : isDark ? '#373a40' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Text fw={600} size="xs" mb={6} c={isDark ? 'gray.2' : 'dark'}>
        {title}
      </Text>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 88 }}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} isDark={isDark} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T28({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committed, setCommitted] = useState<ContainerState>(initialContainers);
  const [saved, setSaved] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const isDark = true;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const dirty =
    !arraysEqual(getItemLabels(containers.available), getItemLabels(committed.available)) ||
    !arraysEqual(getItemLabels(containers.pinned), getItemLabels(committed.pinned));

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const mapped = {
      'Available actions': committed.available,
      'Pinned actions': committed.pinned,
    };
    if (checkExactOrder(mapped, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, saved, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, list] of Object.entries(containers)) {
      if (list.some((item) => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId((over?.id as string) || null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex((item) => item.id === active.id);
      if (activeIndex === -1) return prev;
      const activeItem = activeItems[activeIndex];
      activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex((item) => item.id === over.id);
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
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find((item) => item.id === activeId) : null;

  const handleSave = () => {
    setCommitted({
      available: [...containers.available],
      pinned: [...containers.pinned],
    });
    setSaved(true);
  };

  return (
    <Paper
      shadow="sm"
      p="sm"
      radius="md"
      style={{
        width: 420,
        backgroundColor: '#1a1b1e',
        border: '1px solid #373a40',
      }}
      data-testid="quick-actions-card"
    >
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="sm" c="gray.1">
          Quick actions
        </Text>
        <Badge size="xs" variant="outline" color="gray">
          Dashboard
        </Badge>
      </Group>

      <Group gap={6} mb="sm" wrap="wrap" data-reference-id="ref-quick-actions-dark" style={{ pointerEvents: 'none' }}>
        <Text size="xs" c="dimmed" mr={4}>
          Reference
        </Text>
        {previewOrder.map((label) => (
          <Badge key={label} size="xs" variant="light" color="blue">
            {label}
          </Badge>
        ))}
      </Group>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box style={{ display: 'flex', gap: 10 }}>
          <DroppableContainer
            id="available"
            title="Available actions"
            items={containers.available}
            isOver={overId === 'available'}
            isDark={isDark}
          />
          <DroppableContainer
            id="pinned"
            title="Pinned actions"
            items={containers.pinned}
            isOver={overId === 'pinned'}
            isDark={isDark}
          />
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Box
              style={{
                padding: '6px 10px',
                backgroundColor: '#25262b',
                border: '1px solid #228be6',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              }}
            >
              <IconGripVertical size={12} color="#5c5f66" />
              <Text size="xs" c="gray.1">
                {activeItem.label}
              </Text>
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Group justify="space-between" mt="sm">
        {dirty ? (
          <Badge size="xs" color="yellow" variant="light">
            Unsaved changes
          </Badge>
        ) : (
          <Box />
        )}
        <Button size="xs" onClick={handleSave} data-testid="save-actions" aria-label="Save actions">
          Save actions
        </Button>
      </Group>
    </Paper>
  );
}
