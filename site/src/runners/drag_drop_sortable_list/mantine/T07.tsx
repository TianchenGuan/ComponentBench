'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T07
 * Task Name: Mantine: Match reference (feature ranking)
 *
 * Setup Description:
 * Centered card titled **Feature ranking** contains:
 * - one sortable list with 5 feature items (instances=1),
 * - a **Reference order** panel that shows the desired ranking visually as numbered chips (1–5).
 *
 * Initial list order (top → bottom):
 * Analytics, Automation, Collaboration, Customization, Security.
 *
 * Visual guidance (guidance=visual):
 * - The Reference order panel shows the exact target ordering of the same labels.
 * - The instruction does not repeat the full ordering textually.
 *
 * Dragging behavior:
 * - Handle-only dragging via a small grip icon.
 * - Order updates immediately on drop; no Save.
 *
 * Clutter is low:
 * - A short description paragraph explains that higher items are more important (non-interactive).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Security, Collaboration, Analytics, Automation, Customization.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Badge, Grid, Box } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
  { id: 'analytics', label: 'Analytics' },
  { id: 'automation', label: 'Automation' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'customization', label: 'Customization' },
  { id: 'security', label: 'Security' },
];

const targetOrder = ['security', 'collaboration', 'analytics', 'automation', 'customization'];
const referenceLabels = ['Security', 'Collaboration', 'Analytics', 'Automation', 'Customization'];

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
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#f8f9fa' : 'transparent',
    padding: '10px 12px',
    borderBottom: '1px solid #e9ecef',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
    >
      <Group gap="sm">
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <IconGripVertical size={16} style={{ color: '#adb5bd' }} />
        </div>
        <Text size="sm">{item.label}</Text>
      </Group>
    </div>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 550 }} data-testid="feature-ranking-card">
      <Title order={4} mb="xs">Feature ranking</Title>
      <Text size="sm" c="dimmed" mb="md">
        Higher ranked features are prioritized in the roadmap. Drag to reorder.
      </Text>

      <Grid gutter="md">
        <Grid.Col span={7}>
          <Text fw={500} size="sm" mb="xs">Feature ranking</Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div
                data-testid="sortable-list-feature-ranking"
                style={{ border: '1px solid #e9ecef', borderRadius: 4 }}
              >
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Grid.Col>

        <Grid.Col span={5}>
          <Paper withBorder p="sm" bg="gray.0">
            <Text fw={500} size="xs" mb="sm">Reference order</Text>
            <Box>
              {referenceLabels.map((label, i) => (
                <Badge
                  key={label}
                  variant="outline"
                  color="gray"
                  size="sm"
                  style={{ display: 'block', marginBottom: 6, width: '100%', justifyContent: 'flex-start' }}
                >
                  {i + 1}. {label}
                </Badge>
              ))}
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
