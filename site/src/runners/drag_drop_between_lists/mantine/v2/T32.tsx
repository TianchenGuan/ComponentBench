'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-v2-T32
 * Task Name: Mantine: Reports selector only, matched to reference order
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

const initialReports: ContainerState = {
  'rep-available': [
    { id: 'rep-churn', label: 'Churn' },
    { id: 'rep-mrr', label: 'MRR' },
    { id: 'rep-sessions', label: 'Sessions' },
  ],
  'rep-enabled': [{ id: 'rep-revenue', label: 'Revenue' }],
};

const targetReports = {
  'Enabled reports': ['Revenue', 'Churn', 'MRR'],
};

const previewChips = ['Revenue', 'Churn', 'MRR'];

function StaticList({
  title,
  enabled,
  available,
  instanceLabel,
}: {
  title: string;
  enabled: string[];
  available: string[];
  instanceLabel: string;
}) {
  return (
    <Paper
      p="xs"
      radius="sm"
      withBorder
      style={{ flex: 1, minWidth: 160 }}
      data-task-instance-label={instanceLabel}
    >
      <Text fw={700} size="xs" mb={6}>
        {title}
      </Text>
      <Text size="xs" c="dimmed" mb={4}>
        Enabled
      </Text>
      <Group gap={4} mb="sm">
        {enabled.map((x) => (
          <Badge key={x} size="xs" variant="light">
            {x}
          </Badge>
        ))}
      </Group>
      <Text size="xs" c="dimmed" mb={4}>
        Available
      </Text>
      <Group gap={4}>
        {available.map((x) => (
          <Badge key={x} size="xs" variant="outline" color="gray">
            {x}
          </Badge>
        ))}
      </Group>
    </Paper>
  );
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
        padding: '5px 8px',
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: 4,
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <IconGripVertical size={11} color="#adb5bd" />
      <Text size="xs">{item.label}</Text>
    </Box>
  );
}

function ReportsDroppable({
  id,
  title,
  items,
  isOver,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 110,
        padding: 6,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `2px dashed ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Text fw={600} size="xs" mb={4}>
        {title}
      </Text>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 56 }}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T32({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialReports);
  const [committed, setCommitted] = useState<ContainerState>(initialReports);
  const [saved, setSaved] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const dirty =
    !arraysEqual(getItemLabels(containers['rep-available']), getItemLabels(committed['rep-available'])) ||
    !arraysEqual(getItemLabels(containers['rep-enabled']), getItemLabels(committed['rep-enabled']));

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const mapped = {
      'Available reports': committed['rep-available'],
      'Enabled reports': committed['rep-enabled'],
    };
    if (checkExactOrder(mapped, targetReports)) {
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

  return (
    <Box style={{ maxWidth: 720 }} data-testid="settings-selectors-panel">
      <Group gap={6} mb="xs" wrap="wrap">
        {['Billing', 'API', 'Audit', 'SSO', 'Webhooks', 'Limits'].map((x) => (
          <Badge key={x} size="xs" variant="dot" color="gray">
            {x}
          </Badge>
        ))}
      </Group>
      <Text fw={700} size="sm" mb="sm">
        Workspace settings
      </Text>

      <Group align="flex-start" gap="sm" wrap="nowrap">
        <StaticList
          title="Navigation"
          instanceLabel="Navigation"
          enabled={['Overview', 'Search']}
          available={['Reports', 'Settings']}
        />

        <Paper
          p="xs"
          radius="sm"
          withBorder
          style={{ flex: 1.2, minWidth: 280 }}
          data-task-instance-label="Reports"
        >
          <Text fw={700} size="xs" mb={6}>
            Reports
          </Text>
          <Group gap={6} mb="sm" wrap="wrap" data-reference-id="ref-reports-order" style={{ pointerEvents: 'none' }}>
            <Text size="xs" c="dimmed">
              Reference
            </Text>
            {previewChips.map((c) => (
              <Badge key={c} size="xs" color="teal" variant="filled">
                {c}
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
            <Box style={{ display: 'flex', gap: 8 }}>
              <ReportsDroppable
                id="rep-enabled"
                title="Enabled reports"
                items={containers['rep-enabled']}
                isOver={overId === 'rep-enabled'}
              />
              <ReportsDroppable
                id="rep-available"
                title="Available reports"
                items={containers['rep-available']}
                isOver={overId === 'rep-available'}
              />
            </Box>
            <DragOverlay>
              {activeItem ? (
                <Box
                  style={{
                    padding: '5px 8px',
                    backgroundColor: '#fff',
                    border: '1px solid #228be6',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                >
                  <IconGripVertical size={11} color="#adb5bd" />
                  <Text size="xs">{activeItem.label}</Text>
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>

          <Group justify="space-between" mt="sm">
            {dirty ? (
              <Badge size="xs" color="orange" variant="light">
                Not saved
              </Badge>
            ) : (
              <Box />
            )}
            <Button
              size="compact-xs"
              data-testid="save-reports"
              aria-label="Save reports"
              onClick={() => {
                setCommitted({
                  'rep-available': [...containers['rep-available']],
                  'rep-enabled': [...containers['rep-enabled']],
                });
                setSaved(true);
              }}
            >
              Save reports
            </Button>
          </Group>
        </Paper>

        <StaticList
          title="Admin"
          instanceLabel="Admin"
          enabled={['Users']}
          available={['Roles', 'Billing']}
        />
      </Group>
    </Box>
  );
}
