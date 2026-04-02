'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-v2-T30
 * Task Name: Mantine: Hidden on-call engineer into second position
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Drawer, Group, ScrollArea, Text } from '@mantine/core';
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
import { checkExactOrder } from '../../types';

const availablePool: DraggableItem[] = [
  { id: 'aiden-ross', label: 'Aiden Ross' },
  { id: 'ben-patel', label: 'Ben Patel' },
  { id: 'chris-johnson', label: 'Chris Johnson' },
  { id: 'dana-kim', label: 'Dana Kim' },
  { id: 'eli-nguyen', label: 'Eli Nguyen' },
  { id: 'fatima-ali', label: 'Fatima Ali' },
  { id: 'grace-liu', label: 'Grace Liu' },
  { id: 'hiro-tanaka', label: 'Hiro Tanaka' },
  { id: 'ivy-brooks', label: 'Ivy Brooks' },
  { id: 'mina-hassan', label: 'Mina Hassan' },
  { id: 'zoe-martinez', label: 'Zoe Martinez' },
];

const initialContainers: ContainerState = {
  available: availablePool,
  oncall: [
    { id: 'ava-chen', label: 'Ava Chen' },
    { id: 'leo-garcia', label: 'Leo Garcia' },
  ],
};

const targetState = {
  'Available engineers': [
    'Aiden Ross',
    'Ben Patel',
    'Chris Johnson',
    'Dana Kim',
    'Eli Nguyen',
    'Fatima Ali',
    'Grace Liu',
    'Hiro Tanaka',
    'Ivy Brooks',
    'Mina Hassan',
  ],
  'On-call this week': ['Ava Chen', 'Zoe Martinez', 'Leo Garcia'],
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
        padding: '6px 10px',
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: 4,
        marginBottom: 4,
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

function DroppableContainer({
  id,
  title,
  items,
  isOver,
  scrollAvailable,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  isOver: boolean;
  scrollAvailable?: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  const list = (
    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      <Box style={{ minHeight: scrollAvailable ? 40 : 60 }}>
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </Box>
    </SortableContext>
  );

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 130,
        padding: 8,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `2px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Text fw={600} size="xs" mb={6}>
        {title}
      </Text>
      {scrollAvailable ? (
        <ScrollArea h={200} type="scroll" offsetScrollbars>
          {list}
        </ScrollArea>
      ) : (
        list
      )}
    </Box>
  );
}

export default function T30({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committed, setCommitted] = useState<ContainerState>(initialContainers);
  const [saved, setSaved] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    if (drawerOpen) return;
    const mapped = {
      'Available engineers': committed.available,
      'On-call this week': committed.oncall,
    };
    if (checkExactOrder(mapped, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, saved, drawerOpen, onSuccess]);

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

  return (
    <Box style={{ maxWidth: 400 }} data-testid="on-call-rotation-panel">
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={600}>
          Team roster
        </Text>
        <Button size="xs" variant="light" onClick={() => setDrawerOpen(true)} data-testid="open-on-call-drawer">
          Edit on-call rotation
        </Button>
      </Group>
      <Text size="xs" c="dimmed">
        Schedule and escalation settings (distractor copy).
      </Text>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="On-call rotation"
        position="right"
        size="md"
      >
        <Box p="md">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Box style={{ display: 'flex', gap: 12 }}>
            <DroppableContainer
              id="available"
              title="Available engineers"
              items={containers.available}
              isOver={overId === 'available'}
              scrollAvailable
            />
            <DroppableContainer
              id="oncall"
              title="On-call this week"
              items={containers.oncall}
              isOver={overId === 'oncall'}
            />
          </Box>
          <DragOverlay>
            {activeItem ? (
              <Box
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#fff',
                  border: '1px solid #228be6',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <IconGripVertical size={12} color="#adb5bd" />
                <Text size="xs">{activeItem.label}</Text>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>

        <Button
          fullWidth
          mt="lg"
          size="sm"
          data-testid="save-rotation"
          aria-label="Save rotation"
          onClick={() => {
            setCommitted({
              available: [...containers.available],
              oncall: [...containers.oncall],
            });
            setSaved(true);
            setDrawerOpen(false);
          }}
        >
          Save rotation
        </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
