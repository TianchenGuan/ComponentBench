'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-v2-T15
 * Task Name: Mantine: Modal sprint steps match and confirm
 *
 * Setup Description:
 * Layout is modal_flow with compact spacing and medium clutter. Clicking "Edit sprint steps" opens a Mantine Modal titled "Sprint steps".
 * The modal contains a handle-only sortable list (Plan, Build, Review, Release, Monitor, Retrospective) and a read-only "Reference order" stack.
 * Initial order is Plan, Review, Build, Release, Retrospective, Monitor. "Save order" opens a confirmation dialog with "Confirm" and "Cancel".
 * Only Confirm commits the new order and closes both overlays.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Build, Plan, Review, Monitor, Release, Retrospective.
 * Changes must be committed by activating 'Confirm'.
 * Task ends when the order predicate holds (saved: true, overlay_open: false per YAML).
 *
 * Theme: light, Spacing: compact, Layout: modal_flow, Placement: center, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Title, Group, Text, Paper, Stack, Box } from '@mantine/core';
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

interface StepItem {
  id: string;
  label: string;
}

const initialItems: StepItem[] = [
  { id: 'plan', label: 'Plan' },
  { id: 'review', label: 'Review' },
  { id: 'build', label: 'Build' },
  { id: 'release', label: 'Release' },
  { id: 'retrospective', label: 'Retrospective' },
  { id: 'monitor', label: 'Monitor' },
];

const referenceOrder: StepItem[] = [
  { id: 'build', label: 'Build' },
  { id: 'plan', label: 'Plan' },
  { id: 'review', label: 'Review' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'release', label: 'Release' },
  { id: 'retrospective', label: 'Retrospective' },
];

const targetOrder = referenceOrder.map((s) => s.id);

function SprintBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: '2px 8px',
        borderRadius: 4,
        background: '#e7f5ff',
        color: '#1864ab',
      }}
    >
      {children}
    </span>
  );
}

function SortableRow({ item }: { item: StepItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    backgroundColor: isDragging ? '#f8f9fa' : 'transparent',
    padding: '8px 10px',
    borderBottom: '1px solid #e9ecef',
  };

  return (
    <div ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <Group gap="sm">
        <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex' }}>
          <IconGripVertical size={16} style={{ color: '#adb5bd' }} />
        </span>
        <Text size="sm">{item.label}</Text>
      </Group>
    </div>
  );
}

export default function T15({ onSuccess }: TaskComponentProps) {
  const [mainOpen, setMainOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<StepItem[]>(initialItems);
  const [committedIds, setCommittedIds] = useState<string[]>(initialItems.map((i) => i.id));
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const overlaysOpen = mainOpen || confirmOpen;
    if (!successFired.current && !overlaysOpen && arraysEqual(committedIds, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedIds, mainOpen, confirmOpen, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const openMain = () => {
    setDraftItems(initialItems.map((i) => ({ ...i })));
    setMainOpen(true);
  };

  const handleSaveOrderClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmCommit = () => {
    setCommittedIds(draftItems.map((i) => i.id));
    setConfirmOpen(false);
    setMainOpen(false);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  return (
    <Box p="md" data-testid="sprint-steps-page">
      <Group mb="md" gap="md" wrap="wrap">
        <Text size="xs" c="dimmed">
          Sprint workspace · Q3 delivery
        </Text>
        <SprintBadge>Draft</SprintBadge>
      </Group>

      <Button size="sm" onClick={openMain} data-testid="edit-sprint-steps">
        Edit sprint steps
      </Button>

      <Modal
        opened={mainOpen}
        onClose={() => {
          setMainOpen(false);
          setConfirmOpen(false);
        }}
        title={<Title order={5}>Sprint steps</Title>}
        size="md"
        data-testid="modal-sprint-steps"
      >
        <Group align="flex-start" gap="lg" wrap="nowrap">
          <Paper withBorder p="sm" style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} size="xs" mb="xs">
              Reference order
            </Text>
            <Stack gap={6} data-testid="reference-order-stack">
              {referenceOrder.map((s) => (
                <Paper key={s.id} p={6} withBorder bg="gray.0">
                  <Text size="xs">{s.label}</Text>
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} size="xs" mb="xs">
              Sprint steps
            </Text>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={draftItems} strategy={verticalListSortingStrategy}>
                <div data-testid="sortable-list-sprint-steps" style={{ border: '1px solid #e9ecef', borderRadius: 4 }}>
                  {draftItems.map((item) => (
                    <SortableRow key={item.id} item={item} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </Box>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button variant="default" size="xs" onClick={() => setMainOpen(false)}>
            Close
          </Button>
          <Button size="xs" onClick={handleSaveOrderClick} data-testid="save-order">
            Save order
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={confirmOpen}
        onClose={handleCancelConfirm}
        title="Save sprint order?"
        size="sm"
        data-testid="modal-confirm-save-order"
      >
        <Text size="sm" mb="md">
          Commit the new sprint step ranking? This will close the editor.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" size="xs" onClick={handleCancelConfirm}>
            Cancel
          </Button>
          <Button size="xs" onClick={handleConfirmCommit} data-testid="confirm-save-order">
            Confirm
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
