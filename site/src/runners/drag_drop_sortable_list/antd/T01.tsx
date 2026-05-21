'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T01
 * Task Name: AntD: Move 'Reports' to top (sidebar order)
 *
 * Setup Description:
 * Page shows a single centered card titled **Sidebar order** (Ant Design styling).
 * Inside the card is a vertical sortable list (AntD List-style items) with 5 rows:
 * Home, Projects, Calendar, Reports, Settings (top → bottom).
 *
 * Each row has:
 * - a left drag handle icon (grip/drag glyph),
 * - the item label text,
 * - subtle hover highlight on the row.
 *
 * Interaction details:
 * - Dragging either the handle or the row reorders items immediately (no separate Save/Apply step).
 * - The list is not scrollable (all items visible).
 * - No other components are present (clutter=none).
 *
 * Initial state:
 * - Current order is Home, Projects, Calendar, Reports, Settings.
 * - No item is selected; there are no disabled rows.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Reports, Home, Projects, Calendar, Settings.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List } from 'antd';
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
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];

const targetOrder = ['reports', 'home', 'projects', 'calendar', 'settings'];

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

export default function T01({ onSuccess }: TaskComponentProps) {
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
    <Card
      title="Sidebar order"
      style={{ width: 400 }}
      data-testid="sortable-list-sidebar-order"
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
