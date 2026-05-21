'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T05
 * Task Name: AntD: Reorder Primary shortcuts (two lists)
 *
 * Setup Description:
 * Layout is a **form section** titled **Customize shortcuts** with two sortable lists shown one above the other.
 *
 * Sortable list instances (instances=2):
 * 1) **Primary shortcuts** (target list) — shown first.
 *    Initial order (top → bottom): Home, Search, Messages, Profile.
 * 2) **Secondary shortcuts** — shown below with slightly dimmer styling.
 *    Initial order (top → bottom): Help, Feedback, About, Sign out.
 *
 * Each list item row contains:
 * - a left drag handle icon,
 * - the shortcut label,
 * - a small "pin" icon on the right (decorative, not required for the task).
 *
 * Distractors (clutter=low):
 * - A non-functional text input labeled "Search shortcuts" above the lists.
 * - Two buttons at the bottom: "Cancel" and "Save" (disabled and not required; order applies immediately).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Messages, Home, Search, Profile.
 * Only the list labeled 'Primary shortcuts' counts toward success.
 *
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Input, Button, Typography, Space } from 'antd';
import { HolderOutlined, PushpinOutlined } from '@ant-design/icons';
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

const { Title, Text } = Typography;

const initialPrimaryItems: SortableItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'messages', label: 'Messages' },
  { id: 'profile', label: 'Profile' },
];

const initialSecondaryItems: SortableItem[] = [
  { id: 'help', label: 'Help' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'about', label: 'About' },
  { id: 'signout', label: 'Sign out' },
];

const targetOrder = ['messages', 'home', 'search', 'profile'];

function SortableRow({ item, dimmed = false }: { item: SortableItem; dimmed?: boolean }) {
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
    opacity: isDragging ? 0.8 : dimmed ? 0.7 : 1,
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
          <span style={{ color: dimmed ? '#999' : 'inherit' }}>{item.label}</span>
        </div>
        <PushpinOutlined style={{ color: '#d9d9d9', fontSize: 12 }} />
      </div>
    </List.Item>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryItems, setPrimaryItems] = useState<SortableItem[]>(initialPrimaryItems);
  const [secondaryItems, setSecondaryItems] = useState<SortableItem[]>(initialSecondaryItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = primaryItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [primaryItems, onSuccess]);

  const handlePrimaryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPrimaryItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSecondaryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSecondaryItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card style={{ width: 450 }} data-testid="customize-shortcuts-form">
      <Title level={4} style={{ marginTop: 0 }}>Customize shortcuts</Title>
      
      <Input
        placeholder="Search shortcuts"
        style={{ marginBottom: 24 }}
        disabled
      />

      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary shortcuts</Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handlePrimaryDragEnd}
        >
          <SortableContext items={primaryItems} strategy={verticalListSortingStrategy}>
            <List
              dataSource={primaryItems}
              renderItem={(item) => <SortableRow key={item.id} item={item} />}
              data-testid="sortable-list-primary"
              aria-label="Primary shortcuts"
              bordered
              size="small"
            />
          </SortableContext>
        </DndContext>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8, color: '#999' }}>Secondary shortcuts</Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSecondaryDragEnd}
        >
          <SortableContext items={secondaryItems} strategy={verticalListSortingStrategy}>
            <List
              dataSource={secondaryItems}
              renderItem={(item) => <SortableRow key={item.id} item={item} dimmed />}
              data-testid="sortable-list-secondary"
              aria-label="Secondary shortcuts"
              bordered
              size="small"
            />
          </SortableContext>
        </DndContext>
      </div>

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button disabled>Cancel</Button>
        <Button type="primary" disabled>Save</Button>
      </Space>
    </Card>
  );
}
