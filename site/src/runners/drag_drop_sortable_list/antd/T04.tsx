'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T04
 * Task Name: AntD: Make 'Security' first
 *
 * Setup Description:
 * Centered isolated card titled **Account sections** contains a single sortable list with 5 rows.
 *
 * Initial order (top → bottom):
 * Profile, Notifications, Security, Billing, API Keys.
 *
 * Each row includes:
 * - a drag handle icon on the left,
 * - the section name as text,
 * - a small tag on the right (e.g., 'NEW' on some rows) that is not clickable.
 *
 * Behavior:
 * - The list updates immediately when an item is dropped.
 * - No Save/Apply; no confirmation dialog.
 * - No other components are displayed.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Security, Profile, Notifications, Billing, API Keys.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Tag } from 'antd';
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
import type { TaskComponentProps } from '../types';
import { arraysEqual } from '../types';

interface SectionItem {
  id: string;
  label: string;
  tag?: string;
}

const initialItems: SectionItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications', tag: 'NEW' },
  { id: 'security', label: 'Security' },
  { id: 'billing', label: 'Billing' },
  { id: 'api-keys', label: 'API Keys', tag: 'NEW' },
];

const targetOrder = ['security', 'profile', 'notifications', 'billing', 'api-keys'];

function SortableRow({ item }: { item: SectionItem }) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'grab' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HolderOutlined style={{ color: '#999' }} />
          <span>{item.label}</span>
        </div>
        {item.tag && <Tag color="blue">{item.tag}</Tag>}
      </div>
    </List.Item>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SectionItem[]>(initialItems);
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
    <Card
      title="Account sections"
      style={{ width: 400 }}
      data-testid="sortable-list-account-sections"
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
    </Card>
  );
}
