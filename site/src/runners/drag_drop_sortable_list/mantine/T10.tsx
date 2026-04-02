'use client';

/**
 * Task ID: drag_drop_sortable_list-mantine-T10
 * Task Name: Mantine: Discard drawer reorder via confirmation
 *
 * Setup Description:
 * Scene uses **drawer flow** (drawer anchored to the right).
 * The drawer titled **Support settings** is already open on load.
 *
 * Target component:
 * - A sortable list labeled **Queue order** (instances=1) inside the drawer.
 * - Initial order (top → bottom): General inquiries, Billing issues, Bug reports, Feature requests, VIP customers.
 * - Handle-only dragging via a small grip icon.
 *
 * Drawer controls:
 * - Top-right close button (X icon).
 * - The drawer footer has a disabled **Save** button and an enabled **Close** button (not required if X is used).
 *
 * Confirmation (confirm_cancel):
 * - If the list order has been changed, closing the drawer triggers a confirmation modal titled "Discard changes?"
 * - The modal has two actions: **Keep editing** and **Discard**
 * - Clicking **Discard** closes the drawer and restores the original list order.
 *
 * Distractors (clutter=medium):
 * - Two toggles above the list ("Auto-assign", "Play sound") not required.
 * - A small paragraph under the list describing what queue order means.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: General inquiries, Billing issues, Bug reports, Feature requests, VIP customers.
 * Changes must be committed by activating 'Discard'.
 *
 * Theme: light, Spacing: comfortable, Layout: drawer_flow, Placement: top_right
 */

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Paper, Title, Group, Text, Button, Switch, Modal, Box } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';
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
  { id: 'general-inquiries', label: 'General inquiries' },
  { id: 'billing-issues', label: 'Billing issues' },
  { id: 'bug-reports', label: 'Bug reports' },
  { id: 'feature-requests', label: 'Feature requests' },
  { id: 'vip-customers', label: 'VIP customers' },
];

// Target order is the original order (after discard)
const targetOrder = ['general-inquiries', 'billing-issues', 'bug-reports', 'feature-requests', 'vip-customers'];

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

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const [discardActionTaken, setDiscardActionTaken] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = !arraysEqual(
    items.map(i => i.id),
    initialItems.map(i => i.id)
  );

  useEffect(() => {
    // Success is triggered when:
    // 1. The committed items match the original order (target order)
    // 2. The discard action was explicitly taken
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder) && discardActionTaken) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, discardActionTaken, onSuccess]);

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

  const handleClose = () => {
    if (hasChanges) {
      setModalOpen(true);
    } else {
      setDrawerOpen(false);
    }
  };

  const handleKeepEditing = () => {
    setModalOpen(false);
  };

  const handleDiscard = () => {
    setItems([...initialItems]);
    setCommittedItems([...initialItems]);
    setDiscardActionTaken(true);
    setModalOpen(false);
    setDrawerOpen(false);
  };

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Drawer
        opened={drawerOpen}
        onClose={handleClose}
        title="Support settings"
        position="right"
        size="md"
        data-testid="support-settings-drawer"
      >
        <Box mb="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm">Auto-assign</Text>
            <Switch size="sm" />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Play sound</Text>
            <Switch size="sm" defaultChecked />
          </Group>
        </Box>

        <Text fw={500} size="sm" mb="xs">Queue order</Text>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div
              data-testid="sortable-list-queue-order"
              style={{ border: '1px solid #e9ecef', borderRadius: 4 }}
            >
              {items.map((item) => (
                <SortableRow key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Text size="xs" c="dimmed" mt="sm">
          Higher priority queues are processed first. Drag to change the order.
        </Text>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleClose}>Close</Button>
          <Button disabled>Save</Button>
        </Group>
      </Drawer>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Discard changes?" centered>
        <Text size="sm" mb="md">
          You have unsaved changes to the queue order. Are you sure you want to discard them?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleKeepEditing}>Keep editing</Button>
          <Button color="red" onClick={handleDiscard}>Discard</Button>
        </Group>
      </Modal>
    </Box>
  );
}
