'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T08
 * Task Name: Mantine: Dark dense scrollable list — move 'Changelog' to top
 *
 * Setup Description:
 * Scene is a **dashboard** in **dark theme** with a dense layout (spacing=compact, scale=small, clutter=medium).
 *
 * The target component is a card titled **Report sections** anchored near the bottom-left of the viewport.
 * The card contains a scrollable sortable list (instances=1):
 * - Only ~6 rows are visible; the rest require scrolling inside the list container.
 *
 * Initial order (top → bottom):
 * Executive summary, Key metrics, Revenue, Costs, Customer feedback, Roadmap, Risks, Compliance, Operations, Marketing, Sales, Support, Engineering, HR, Legal, Appendix, Changelog.
 *
 * Dragging behavior:
 * - Handle-only dragging via a small grip icon.
 * - While dragging, the list autoscrolls when the pointer approaches the top/bottom edges.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Changelog, Executive summary, Key metrics, Revenue, Costs, Customer feedback, Roadmap, Risks, Compliance, Operations, Marketing, Sales, Support, Engineering, HR, Legal, Appendix.
 *
 * Theme: dark, Spacing: compact, Layout: dashboard, Placement: bottom_left, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, MantineProvider, Box, Badge, ActionIcon } from '@mantine/core';
import { IconGripVertical, IconCalendar, IconBell, IconDownload } from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, SortableItem } from '../types';
import { arraysEqual } from '../types';

const initialItems: SortableItem[] = [
  { id: 'executive-summary', label: 'Executive summary' },
  { id: 'key-metrics', label: 'Key metrics' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'costs', label: 'Costs' },
  { id: 'customer-feedback', label: 'Customer feedback' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'risks', label: 'Risks' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'operations', label: 'Operations' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'support', label: 'Support' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'hr', label: 'HR' },
  { id: 'legal', label: 'Legal' },
  { id: 'appendix', label: 'Appendix' },
  { id: 'changelog', label: 'Changelog' },
];

const targetOrder = ['changelog', 'executive-summary', 'key-metrics', 'revenue', 'costs', 'customer-feedback', 'roadmap', 'risks', 'compliance', 'operations', 'marketing', 'sales', 'support', 'engineering', 'hr', 'legal', 'appendix'];

function SortableRow({ item }: { item: SortableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '6px 8px',
    borderBottom: '1px solid #373A40',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
    >
      <Group gap="xs">
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <IconGripVertical size={12} style={{ color: '#5C5F66' }} />
        </div>
        <Text size="xs">{item.label}</Text>
      </Group>
    </div>
  );
}

function DragOverlayItem({ item }: { item: SortableItem }) {
  return (
    <Paper p="xs" withBorder style={{ background: '#25262B' }}>
      <Group gap="xs">
        <IconGripVertical size={12} style={{ color: '#5C5F66' }} />
        <Text size="xs">{item.label}</Text>
      </Group>
    </Paper>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = items.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [items, onSuccess]);

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box style={{ minHeight: '100vh', background: '#1A1B1E', padding: 16 }}>
        {/* Dashboard header */}
        <Group justify="space-between" mb="md">
          <Title order={5} c="white">Reports Dashboard</Title>
          <Group gap="xs">
            <Badge leftSection={<IconCalendar size={12} />} variant="light" color="gray">
              Last 30 days
            </Badge>
            <ActionIcon variant="subtle" color="gray">
              <IconBell size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray">
              <IconDownload size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Group align="flex-start" gap="md">
          {/* Target card */}
          <Paper withBorder p="sm" style={{ width: 220, background: '#25262B' }} data-testid="report-sections-card">
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="sm">Report sections</Text>
              <Badge size="xs" variant="light">Filter</Badge>
            </Group>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div
                  data-testid="sortable-list-report-sections"
                  style={{
                    maxHeight: 260,
                    overflowY: 'auto',
                    border: '1px solid #373A40',
                    borderRadius: 4,
                  }}
                >
                  {items.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeItem ? <DragOverlayItem item={activeItem} /> : null}
              </DragOverlay>
            </DndContext>
          </Paper>

          {/* Distractor charts */}
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Paper withBorder p="sm" style={{ width: 200, height: 120, background: '#25262B' }}>
              <Text size="xs" fw={500} mb="xs">Revenue</Text>
              <Box style={{ height: 70, background: '#2C2E33', borderRadius: 4 }} />
            </Paper>
            <Paper withBorder p="sm" style={{ width: 200, height: 120, background: '#25262B' }}>
              <Text size="xs" fw={500} mb="xs">Costs</Text>
              <Box style={{ height: 70, background: '#2C2E33', borderRadius: 4 }} />
            </Paper>
          </Box>
        </Group>
      </Box>
    </MantineProvider>
  );
}
