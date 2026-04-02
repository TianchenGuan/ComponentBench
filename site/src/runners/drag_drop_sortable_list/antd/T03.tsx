'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T03
 * Task Name: AntD: Move 'Help' to last
 *
 * Setup Description:
 * The page contains a single card centered in the viewport titled **Workspace menu**.
 * Inside is one vertical drag-and-drop sortable list with 5 menu items.
 *
 * Visible order at load (top → bottom):
 * Dashboard, Alerts, Teams, Help, Settings.
 *
 * Each item:
 * - has a left drag handle icon,
 * - shows a bold label (e.g., 'Alerts'),
 * - shows a small gray description line under the label (non-interactive text).
 *
 * Behavior:
 * - Drag-and-drop reorders immediately on drop.
 * - No confirmation step; no toast.
 * - No additional UI elements (clutter=none).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Dashboard, Alerts, Teams, Settings, Help.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Typography } from 'antd';
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

const { Text } = Typography;

interface MenuItem {
  id: string;
  label: string;
  description: string;
}

const initialItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'View your overview' },
  { id: 'alerts', label: 'Alerts', description: 'Manage notifications' },
  { id: 'teams', label: 'Teams', description: 'Collaborate with others' },
  { id: 'help', label: 'Help', description: 'Get support' },
  { id: 'settings', label: 'Settings', description: 'Configure preferences' },
];

const targetOrder = ['dashboard', 'alerts', 'teams', 'settings', 'help'];

function SortableRow({ item }: { item: MenuItem }) {
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'grab', width: '100%' }}>
        <HolderOutlined style={{ color: '#999', marginTop: 4 }} />
        <div>
          <div style={{ fontWeight: 600 }}>{item.label}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
        </div>
      </div>
    </List.Item>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
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
      title="Workspace menu"
      style={{ width: 400 }}
      data-testid="sortable-list-workspace-menu"
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
