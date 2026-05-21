'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T10
 * Task Name: Match a homepage preview layout and apply
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, Button, Badge, Group } from '@mantine/core';
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
import { checkExactOrder, getItemLabels, arraysEqual } from '../types';

const initialContainers: ContainerState = {
  hidden: [
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ],
  visible: [
    { id: 'hero', label: 'Hero' },
    { id: 'testimonials', label: 'Testimonials' },
  ],
};

const targetState = {
  'Hidden sections': ['Testimonials'],
  'Visible sections': ['Hero', 'Pricing', 'FAQ', 'Contact'],
};

const previewSections = ['Hero', 'Pricing', 'FAQ', 'Contact'];

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
        borderRadius: 8,
        border: `2px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Text fw={600} size="sm" mb={8}>{title}</Text>
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

export default function T10({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [committedContainers, setCommittedContainers] = useState<ContainerState>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const hasChanges = !arraysEqual(
    getItemLabels(containers.visible),
    getItemLabels(committedContainers.visible)
  ) || !arraysEqual(
    getItemLabels(containers.hidden),
    getItemLabels(committedContainers.hidden)
  );

  useEffect(() => {
    if (successFired.current) return;
    const mappedContainers = {
      'Hidden sections': committedContainers.hidden,
      'Visible sections': committedContainers.visible,
    };
    if (checkExactOrder(mappedContainers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedContainers, onSuccess]);

  const handleApply = () => {
    setCommittedContainers({ hidden: [...containers.hidden], visible: [...containers.visible] });
  };

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
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 520 }} data-testid="homepage-layout-card">
      <Text fw={600} size="lg" mb="md">Homepage Layout</Text>
      
      <Group align="flex-start" gap="md">
        <Box style={{ flex: 1 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box style={{ display: 'flex', gap: 12 }}>
              <DroppableContainer id="hidden" title="Hidden sections" items={containers.hidden} isOver={overId === 'hidden'} />
              <DroppableContainer id="visible" title="Visible sections" items={containers.visible} isOver={overId === 'visible'} />
            </Box>

            <DragOverlay>
              {activeItem ? (
                <Box
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#fff',
                    border: '1px solid #228be6',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <IconGripVertical size={14} color="#adb5bd" />
                  <Text size="sm">{activeItem.label}</Text>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>

        <Box
          style={{ width: 120, padding: 10, backgroundColor: '#ebfbee', borderRadius: 8, border: '1px solid #b2f2bb' }}
          data-testid="layout-preview"
        >
          <Text size="xs" fw={600} c="green" mb={6}>Preview</Text>
          {previewSections.map(s => (
            <Box
              key={s}
              style={{
                backgroundColor: '#40c057',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: 4,
                marginBottom: 4,
                fontSize: 10,
                textAlign: 'center',
              }}
            >
              {s}
            </Box>
          ))}
          <Text size="xs" c="dimmed" mt={6}>Match Visible sections to the preview</Text>
        </Box>
      </Group>

      <Group justify="space-between" mt="md">
        {hasChanges && <Badge color="yellow" variant="light" size="sm">Not applied</Badge>}
        {!hasChanges && <Box />}
        <Button onClick={handleApply} data-testid="apply-layout-button">Apply layout</Button>
      </Group>

      <input
        type="hidden"
        data-testid="layout-committed-json"
        value={JSON.stringify({
          hidden: getItemLabels(committedContainers.hidden),
          visible: getItemLabels(committedContainers.visible),
        })}
      />
    </Paper>
  );
}
