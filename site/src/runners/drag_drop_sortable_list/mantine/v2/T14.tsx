'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-v2-T14
 * Task Name: Mantine: Save only the secondary badge ordering
 *
 * Setup Description:
 * Layout is settings_panel with compact spacing and medium clutter. Three compact sortable lists appear one above another:
 * Primary status badges, Secondary status badges (target), Email badges.
 * Initial Secondary order is Open, Blocked, Muted, Review. Each list has its own small footer action.
 * The target footer button reads "Save secondary badges". Rows are handle-only and compact.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Open, Muted, Review, Blocked.
 * Changes must be committed by activating 'Save secondary badges'.
 * Only the instance labeled 'Secondary status badges' counts toward success and non-target instances must remain unchanged.
 * Task ends when the order predicate holds.
 *
 * Theme: light, Spacing: compact, Layout: settings_panel, Placement: bottom_right, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Title, Group, Text, Button } from '@mantine/core';
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

interface RowItem {
  id: string;
  label: string;
}

const primaryInitial: RowItem[] = [
  { id: 'open', label: 'Open' },
  { id: 'review', label: 'Review' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'closed', label: 'Closed' },
];

const secondaryInitial: RowItem[] = [
  { id: 'open', label: 'Open' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'muted', label: 'Muted' },
  { id: 'review', label: 'Review' },
];

const emailInitial: RowItem[] = [
  { id: 'important', label: 'Important' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'muted', label: 'Muted' },
  { id: 'archive', label: 'Archive' },
];

const secondaryTargetIds = ['open', 'muted', 'review', 'blocked'];
const primaryTargetIds = primaryInitial.map((i) => i.id);
const emailTargetIds = emailInitial.map((i) => i.id);

function SortableRow({ item, instance }: { item: RowItem; instance: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: isDragging ? '#f1f3f5' : 'transparent',
    padding: '6px 8px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} data-testid={`sortable-item-${instance}-${item.id}`}>
      <Group gap="xs" wrap="nowrap">
        <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex' }}>
          <IconGripVertical size={14} style={{ color: '#adb5bd' }} />
        </span>
        <Text size="xs">{item.label}</Text>
      </Group>
    </div>
  );
}

function BadgeListBlock({
  title,
  testId,
  items,
  setItems,
  saveLabel,
  onSave,
}: {
  title: string;
  testId: string;
  items: RowItem[];
  setItems: React.Dispatch<React.SetStateAction<RowItem[]>>;
  saveLabel: string;
  onSave: () => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const instanceKey = testId.replace('sortable-list-', '');

  return (
    <Paper p="xs" withBorder mb="sm" data-testid={testId + '-card'}>
      <Text fw={600} size="xs" mb={4}>
        {title}
      </Text>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div data-testid={testId} style={{ border: '1px solid #e9ecef', borderRadius: 4 }}>
            {items.map((item) => (
              <SortableRow key={item.id} item={item} instance={instanceKey} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Group justify="flex-end" mt={6}>
        <Button size="xs" variant="light" onClick={onSave}>
          {saveLabel}
        </Button>
      </Group>
    </Paper>
  );
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const [primaryItems, setPrimaryItems] = useState(primaryInitial);
  const [secondaryItems, setSecondaryItems] = useState(secondaryInitial);
  const [emailItems, setEmailItems] = useState(emailInitial);

  const [primaryCommitted, setPrimaryCommitted] = useState(primaryInitial);
  const [secondaryCommitted, setSecondaryCommitted] = useState(secondaryInitial);
  const [emailCommitted, setEmailCommitted] = useState(emailInitial);

  const successFired = useRef(false);

  useEffect(() => {
    const secOk = arraysEqual(
      secondaryCommitted.map((i) => i.id),
      secondaryTargetIds
    );
    const primOk = arraysEqual(
      primaryCommitted.map((i) => i.id),
      primaryTargetIds
    );
    const emailOk = arraysEqual(
      emailCommitted.map((i) => i.id),
      emailTargetIds
    );
    if (!successFired.current && secOk && primOk && emailOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [secondaryCommitted, primaryCommitted, emailCommitted, onSuccess]);

  return (
    <Paper p="md" withBorder style={{ width: 280 }} data-testid="settings-badge-panel">
      <BadgeListBlock
        title="Primary status badges"
        testId="sortable-list-primary-badges"
        items={primaryItems}
        setItems={setPrimaryItems}
        saveLabel="Save primary badges"
        onSave={() => setPrimaryCommitted([...primaryItems])}
      />
      <BadgeListBlock
        title="Secondary status badges"
        testId="sortable-list-secondary-status-badges"
        items={secondaryItems}
        setItems={setSecondaryItems}
        saveLabel="Save secondary badges"
        onSave={() => setSecondaryCommitted([...secondaryItems])}
      />
      <BadgeListBlock
        title="Email badges"
        testId="sortable-list-email-badges"
        items={emailItems}
        setItems={setEmailItems}
        saveLabel="Save email badges"
        onSave={() => setEmailCommitted([...emailItems])}
      />
    </Paper>
  );
}
