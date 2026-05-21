'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T02
 * Task Name: AntD: Place 'Invoices' under 'Overview'
 *
 * Setup Description:
 * A centered isolated card titled **Billing navigation** contains one sortable list with 5 items.
 * The list uses Ant Design list-row styling with generous padding.
 *
 * Rows (top → bottom) at load:
 * Overview, Billing, Invoices, Usage, Integrations.
 *
 * Each row shows:
 * - drag handle icon on the left,
 * - the label in plain text,
 * - a right chevron icon as a non-interactive decoration.
 *
 * Behavior:
 * - Reordering happens immediately on drop (no Save button).
 * - All items are visible without scrolling.
 * - No other page controls are present.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Overview, Invoices, Billing, Usage, Integrations.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List } from 'antd';
import { HolderOutlined, RightOutlined } from '@ant-design/icons';
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
  { id: 'overview', label: 'Overview' },
  { id: 'billing', label: 'Billing' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'usage', label: 'Usage' },
  { id: 'integrations', label: 'Integrations' },
];

const targetOrder = ['overview', 'invoices', 'billing', 'usage', 'integrations'];

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'grab' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HolderOutlined style={{ color: '#999' }} />
          <span>{item.label}</span>
        </div>
        <RightOutlined style={{ color: '#999', fontSize: 12 }} />
      </div>
    </List.Item>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
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
      title="Billing navigation"
      style={{ width: 400 }}
      data-testid="sortable-list-billing-navigation"
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
