'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-v2-T31
 * Task Name: Mantine: Discard integration draft after real transfers
 */

import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Group, Modal, Text } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
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
import { checkSetMembership, getItemLabels, arraysEqual } from '../../types';

const COMMITTED: ContainerState = {
  available: [
    { id: 'jira', label: 'Jira' },
    { id: 'slack', label: 'Slack' },
  ],
  connected: [
    { id: 'github', label: 'GitHub' },
    { id: 'zapier', label: 'Zapier' },
  ],
};

const targetState = {
  'Available integrations': ['Jira', 'Slack'],
  'Connected integrations': ['GitHub', 'Zapier'],
};

function SortableItem({ item, isDark }: { item: DraggableItem; isDark: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        padding: '8px 12px',
        backgroundColor: isDragging ? '#1c2f45' : isDark ? '#25262b' : '#fff',
        border: `1px solid ${isDragging ? '#228be6' : isDark ? '#373a40' : '#e9ecef'}`,
        borderRadius: 6,
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.35)' : 'none',
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
      }}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <IconGripVertical size={14} color={isDark ? '#5c5f66' : '#adb5bd'} />
      <Text size="sm" c={isDark ? 'gray.2' : 'dark'}>
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
        minWidth: 140,
        padding: 10,
        backgroundColor: isOver ? (isDark ? '#1c2f45' : '#e7f5ff') : isDark ? '#1a1b1e' : '#f8f9fa',
        borderRadius: 8,
        border: `2px dashed ${isOver ? '#228be6' : isDark ? '#373a40' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Text fw={600} size="sm" mb={8} c={isDark ? 'gray.2' : 'dark'}>
        {title}
      </Text>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 100 }}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} isDark={isDark} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T31({ onSuccess }: TaskComponentProps) {
  const [mainOpen, setMainOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [containers, setContainers] = useState<ContainerState>(COMMITTED);
  const [dirtyTransfers, setDirtyTransfers] = useState(false);
  const [discardedAfterDirty, setDiscardedAfterDirty] = useState(false);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const isDark = true;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const unsaved =
    !arraysEqual(getItemLabels(containers.available), getItemLabels(COMMITTED.available)) ||
    !arraysEqual(getItemLabels(containers.connected), getItemLabels(COMMITTED.connected));

  useEffect(() => {
    if (mainOpen && unsaved) setDirtyTransfers(true);
  }, [mainOpen, unsaved]);

  useEffect(() => {
    if (successFired.current) return;
    if (!discardedAfterDirty) return;
    if (mainOpen || confirmOpen) return;
    const mapped = {
      'Available integrations': containers.available,
      'Connected integrations': containers.connected,
    };
    if (checkSetMembership(mapped, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, discardedAfterDirty, mainOpen, confirmOpen, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, list] of Object.entries(containers)) {
      if (list.some((item) => item.id === id)) return containerId;
    }
    return undefined;
  };

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

  const openMain = () => {
    setContainers({
      available: [...COMMITTED.available],
      connected: [...COMMITTED.connected],
    });
    setDirtyTransfers(false);
    setMainOpen(true);
  };

  const requestCloseMain = () => {
    if (unsaved) setConfirmOpen(true);
    else setMainOpen(false);
  };

  const handleDiscard = () => {
    if (!dirtyTransfers) {
      setConfirmOpen(false);
      return;
    }
    setContainers({
      available: [...COMMITTED.available],
      connected: [...COMMITTED.connected],
    });
    setDiscardedAfterDirty(true);
    setConfirmOpen(false);
    setMainOpen(false);
  };

  return (
    <Box style={{ maxWidth: 420 }} data-testid="integrations-settings">
      <Text size="sm" c="dimmed" mb="sm">
        Connect tools for your workspace. Changes apply after confirmation.
      </Text>
      <Button size="sm" onClick={openMain} data-testid="edit-integrations-button">
        Edit integrations
      </Button>

      <Modal opened={mainOpen} onClose={requestCloseMain} title="Edit integrations" centered size="lg">
        <Group justify="space-between" mb="sm">
          {unsaved ? (
            <Badge color="yellow" variant="light" size="sm">
              Unsaved changes
            </Badge>
          ) : (
            <Box />
          )}
        </Group>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Box style={{ display: 'flex', gap: 14 }}>
            <DroppableContainer
              id="available"
              title="Available integrations"
              items={containers.available}
              isOver={overId === 'available'}
              isDark={isDark}
            />
            <DroppableContainer
              id="connected"
              title="Connected integrations"
              items={containers.connected}
              isOver={overId === 'connected'}
              isDark={isDark}
            />
          </Box>
        </DndContext>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={requestCloseMain}>
            Cancel
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Discard changes?"
        centered
        size="sm"
        zIndex={400}
      >
        <Text size="sm" mb="md" c="dimmed">
          You have unsaved edits to integrations.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setConfirmOpen(false)}>
            Keep editing
          </Button>
          <Button color="red" data-testid="discard-changes" aria-label="Discard changes" onClick={handleDiscard}>
            Discard changes
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
