'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T07
 * Task Name: AntD: Reorder onboarding steps and save
 *
 * Setup Description:
 * A centered isolated card titled **Onboarding steps** contains:
 * - a sortable list of steps (4 items),
 * - a primary button labeled **Save order** below the list,
 * - a secondary button labeled **Reset** (not required).
 *
 * Initial step order (top → bottom):
 * Create account, Verify email, Connect workspace, Invite team.
 *
 * Drag interaction:
 * - Each row has a left drag handle icon and the step title text.
 * - Reordering updates the list immediately, but the change is considered *uncommitted* until it is saved.
 *
 * Confirmation flow:
 * - Clicking **Save order** opens a small AntD Popconfirm anchored to the button with the message "Save this order?"
 * - The Popconfirm has two buttons: **Confirm** and **Cancel**
 * - Only **Confirm** commits the new order; **Cancel** keeps the changes uncommitted.
 *
 * Feedback:
 * - After confirming, a success toast appears: "Order saved".
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Verify email, Create account, Connect workspace, Invite team.
 * Changes must be committed by activating 'Confirm'.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Popconfirm, Space, message } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
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
  { id: 'create-account', label: 'Create account' },
  { id: 'verify-email', label: 'Verify email' },
  { id: 'connect-workspace', label: 'Connect workspace' },
  { id: 'invite-team', label: 'Invite team' },
];

const targetOrder = ['verify-email', 'create-account', 'connect-workspace', 'invite-team'];

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
    background: isDragging ? '#f5f5f5' : 'transparent',
  };

  return (
    <List.Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`sortable-item-${item.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'grab', width: '100%' }}>
        <HolderOutlined style={{ color: '#999' }} />
        <span>{item.label}</span>
      </div>
    </List.Item>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = committedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, onSuccess]);

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

  const handleConfirm = () => {
    setCommittedItems([...items]);
    message.success('Order saved');
  };

  const handleReset = () => {
    setItems([...initialItems]);
    setCommittedItems([...initialItems]);
  };

  return (
    <Card
      title="Onboarding steps"
      style={{ width: 400 }}
      data-testid="sortable-list-onboarding-steps"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <List
            dataSource={items}
            renderItem={(item) => <SortableRow key={item.id} item={item} />}
            data-testid="sortable-list"
          />
        </SortableContext>
      </DndContext>

      <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
        <Button onClick={handleReset}>Reset</Button>
        <Popconfirm
          title="Save this order?"
          onConfirm={handleConfirm}
          okText="Confirm"
          cancelText="Cancel"
        >
          <Button type="primary">Save order</Button>
        </Popconfirm>
      </Space>
    </Card>
  );
}
