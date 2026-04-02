'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-T04
 * Task Name: Move a ticket in the correct project (two instances)
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
import type { TaskComponentProps, DraggableItem } from '../types';
import { checkSetMembership } from '../types';

interface ProjectState {
  backlog: DraggableItem[];
  inProgress: DraggableItem[];
}

const initialAlpha: ProjectState = {
  backlog: [
    { id: 'alpha-db', label: 'Database migration' },
    { id: 'alpha-ui', label: 'UI refresh' },
  ],
  inProgress: [{ id: 'alpha-login', label: 'Login bugfix' }],
};

const initialBeta: ProjectState = {
  backlog: [
    { id: 'beta-db', label: 'Database migration' },
    { id: 'beta-payments', label: 'Payments integration' },
  ],
  inProgress: [{ id: 'beta-api', label: 'API rate limiting' }],
};

const targetBetaState = {
  'Backlog': ['Payments integration'],
  'In progress': ['API rate limiting', 'Database migration'],
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
        padding: '8px 10px',
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
      <IconGripVertical size={10} color="#adb5bd" />
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
        minWidth: 120,
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

function ProjectCard({
  title,
  containers,
  setContainers,
  prefix,
  instanceId,
}: {
  title: string;
  containers: ProjectState;
  setContainers: React.Dispatch<React.SetStateAction<ProjectState>>;
  prefix: string;
  instanceId: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string): string | undefined => {
    if (id === `${prefix}-backlog` || id === `${prefix}-inProgress`) return id.replace(`${prefix}-`, '');
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some((item: DraggableItem) => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId(over?.id as string || null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    let overContainer = findContainer(over.id as string);
    if (!overContainer && (over.id as string).startsWith(prefix)) overContainer = (over.id as string).replace(`${prefix}-`, '');
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    setContainers(prev => {
      const activeItems = [...prev[activeContainer as keyof ProjectState]];
      const overItems = [...prev[overContainer as keyof ProjectState]];
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
      const items = containers[activeContainer as keyof ProjectState];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer as keyof ProjectState], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? [...containers.backlog, ...containers.inProgress].find(item => item.id === activeId) : null;

  return (
    <Paper shadow="xs" p="sm" mb="sm" data-testid={`dnd-instance-${instanceId}`}>
      <Text fw={600} size="sm" mb="xs">{title}</Text>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 8 }}>
          <DroppableContainer id={`${prefix}-backlog`} title="Backlog" items={containers.backlog} isOver={overId === `${prefix}-backlog`} />
          <DroppableContainer id={`${prefix}-inProgress`} title="In progress" items={containers.inProgress} isOver={overId === `${prefix}-inProgress`} />
        </Box>
        <DragOverlay>
          {activeItem ? (
            <Box style={{ padding: '8px 10px', backgroundColor: '#fff', border: '1px solid #228be6', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <IconGripVertical size={10} color="#adb5bd" />
              <Text size="xs">{activeItem.label}</Text>
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState<ProjectState>(initialAlpha);
  const [beta, setBeta] = useState<ProjectState>(initialBeta);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const mappedContainers = {
      'Backlog': beta.backlog,
      'In progress': beta.inProgress,
    };
    if (checkSetMembership(mappedContainers, targetBetaState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [beta, onSuccess]);

  return (
    <Box style={{ width: 360 }}>
      <ProjectCard title="Project Alpha" containers={alpha} setContainers={setAlpha} prefix="alpha" instanceId="project-alpha" />
      <ProjectCard title="Project Beta" containers={beta} setContainers={setBeta} prefix="beta" instanceId="project-beta" />
    </Box>
  );
}
