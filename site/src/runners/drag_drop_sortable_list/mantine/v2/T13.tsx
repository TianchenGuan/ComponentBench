'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-v2-T13
 * Task Name: Mantine: Dense dashboard list with hidden changelog and save
 *
 * Setup Description:
 * Layout is dashboard_panel in dark theme with compact spacing, small scale, and high clutter.
 * The target card titled "Report sections" sits near the bottom-left of the viewport under a mini chart and beside filter chips.
 *
 * The card contains a fixed-height Mantine ScrollArea with a handle-only sortable list. Only six rows are visible at once.
 * Initial order ends with "... Legal, Appendix, Changelog". Moving items uses autoscroll near edges.
 * A footer button "Save sections" commits the list.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Executive summary … Legal, Changelog, Appendix (full list in YAML).
 * Changes must be committed by activating 'Save sections'.
 * Task ends when the order predicate holds.
 *
 * Theme: dark, Spacing: compact, Layout: dashboard_panel, Placement: bottom_left, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button, ScrollArea, Badge, Box } from '@mantine/core';
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
import type { TaskComponentProps } from '../../types';
import { arraysEqual } from '../../types';

interface SectionItem {
  id: string;
  label: string;
}

const sectionDefs: SectionItem[] = [
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
  { id: 'changelog', label: 'Changelog' },
  { id: 'appendix', label: 'Appendix' },
];

/** Initial: … Legal, Appendix, Changelog (Changelog below Appendix) */
const initialItems: SectionItem[] = (() => {
  const base = sectionDefs.filter((s) => !['appendix', 'changelog'].includes(s.id));
  const appendix = { id: 'appendix', label: 'Appendix' };
  const changelog = { id: 'changelog', label: 'Changelog' };
  return [...base, appendix, changelog];
})();

const targetOrder = sectionDefs.map((s) => s.id);

function SortableRow({ item }: { item: SectionItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: isDragging ? 'var(--mantine-color-dark-6)' : 'transparent',
    padding: '6px 10px',
    borderBottom: '1px solid var(--mantine-color-dark-4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  };

  return (
    <div ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <Group gap="sm" wrap="nowrap">
        <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', flexShrink: 0 }}>
          <IconGripVertical size={14} color="var(--mantine-color-gray-5)" />
        </span>
        <Text size="xs" c="gray.2" lineClamp={1}>
          {item.label}
        </Text>
      </Group>
    </div>
  );
}

export default function T13({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SectionItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SectionItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map((item) => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <Box p="md" style={{ background: '#1a1b1e', minHeight: 320 }}>
      <Group align="flex-start" gap="md" wrap="wrap">
        <Paper p="xs" withBorder style={{ flex: '0 0 200px', background: '#25262b', borderColor: '#373a40' }}>
          <Text size="xs" c="dimmed" mb={4}>
            Pipeline
          </Text>
          <Group gap={4} align="flex-end" style={{ height: 56 }}>
            {[40, 65, 35, 80, 50].map((h, i) => (
              <Box key={i} style={{ width: 14, height: h, background: '#4c6ef5', borderRadius: 2 }} />
            ))}
          </Group>
        </Paper>

        <Group gap="xs">
          {['FY24', 'Approved', 'Draft'].map((t) => (
            <Badge key={t} size="xs" variant="light" color="gray">
              {t}
            </Badge>
          ))}
        </Group>
      </Group>

      <Paper
        mt="lg"
        p="sm"
        withBorder
        style={{ maxWidth: 320, background: '#25262b', borderColor: '#373a40' }}
        data-testid="report-sections-card"
      >
        <Title order={5} size="sm" c="gray.1" mb="xs">
          Report sections
        </Title>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ScrollArea h={168} type="auto" offsetScrollbars data-testid="sortable-list-scroll">
              <div data-testid="sortable-list-report-sections">
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          </SortableContext>
        </DndContext>

        <Group justify="flex-end" mt="sm">
          <Button
            size="xs"
            onClick={() => setCommittedItems([...items])}
            data-testid="save-sections"
          >
            Save sections
          </Button>
        </Group>
      </Paper>
    </Box>
  );
}
