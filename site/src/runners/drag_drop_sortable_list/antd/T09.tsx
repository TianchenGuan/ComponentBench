'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T09
 * Task Name: AntD: Match reference order for Pinned tags (two lists)
 *
 * Setup Description:
 * A centered card titled **Tag priority** shows two sortable lists side-by-side (instances=2):
 *
 * Left column:
 * - **Pinned tags** (target list) — sortable list with 5 tag rows.
 *   Initial order (top → bottom): Urgent, High, Medium, Low, Backlog.
 *   Each row shows a colored dot and the tag label.
 *   Rows have a left drag handle icon.
 *
 * Right column:
 * - **Hidden tags** — sortable list with 3 rows (not the target).
 *   Initial order (top → bottom): Spam, Muted, Archived.
 *
 * Visual guidance (guidance=visual):
 * - Above the two lists is a small panel titled **Reference order** that shows the desired ordering for *Pinned tags* as a stacked preview (no text instruction repeats the full order).
 * - The preview visually lists the same tag labels in the target order.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: High, Urgent, Medium, Low, Backlog.
 * Only the list labeled 'Pinned tags' counts toward success.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Row, Col, Badge } from 'antd';
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

const { Text, Title } = Typography;

interface TagItem {
  id: string;
  label: string;
  color: string;
}

const initialPinnedItems: TagItem[] = [
  { id: 'urgent', label: 'Urgent', color: '#ff4d4f' },
  { id: 'high', label: 'High', color: '#fa8c16' },
  { id: 'medium', label: 'Medium', color: '#faad14' },
  { id: 'low', label: 'Low', color: '#52c41a' },
  { id: 'backlog', label: 'Backlog', color: '#8c8c8c' },
];

const initialHiddenItems: TagItem[] = [
  { id: 'spam', label: 'Spam', color: '#595959' },
  { id: 'muted', label: 'Muted', color: '#bfbfbf' },
  { id: 'archived', label: 'Archived', color: '#d9d9d9' },
];

// Target order shown in reference
const targetOrder = ['high', 'urgent', 'medium', 'low', 'backlog'];
const referenceItems: TagItem[] = [
  { id: 'high', label: 'High', color: '#fa8c16' },
  { id: 'urgent', label: 'Urgent', color: '#ff4d4f' },
  { id: 'medium', label: 'Medium', color: '#faad14' },
  { id: 'low', label: 'Low', color: '#52c41a' },
  { id: 'backlog', label: 'Backlog', color: '#8c8c8c' },
];

function SortableRow({ item }: { item: TagItem }) {
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
    padding: '8px 12px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`sortable-item-${item.id}`}
    >
      <HolderOutlined style={{ color: '#999', cursor: 'grab' }} />
      <Badge color={item.color} />
      <span>{item.label}</span>
    </div>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [pinnedItems, setPinnedItems] = useState<TagItem[]>(initialPinnedItems);
  const [hiddenItems, setHiddenItems] = useState<TagItem[]>(initialHiddenItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const currentOrder = pinnedItems.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [pinnedItems, onSuccess]);

  const handlePinnedDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPinnedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleHiddenDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setHiddenItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card style={{ width: 600 }} data-testid="tag-priority-card">
      <Title level={4} style={{ marginTop: 0 }}>Tag priority</Title>

      {/* Reference order panel */}
      <div style={{ background: '#fafafa', padding: 12, borderRadius: 4, marginBottom: 16 }}>
        <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Reference order</Text>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {referenceItems.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#999' }}>{index + 1}.</span>
              <Badge color={item.color} />
              <span style={{ fontSize: 12 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Row gutter={24}>
        <Col span={12}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Pinned tags</Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handlePinnedDragEnd}
          >
            <SortableContext items={pinnedItems} strategy={verticalListSortingStrategy}>
              <div
                style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}
                data-testid="sortable-list-pinned-tags"
                aria-label="Pinned tags"
              >
                {pinnedItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Col>
        <Col span={12}>
          <Text strong style={{ display: 'block', marginBottom: 8, color: '#999' }}>Hidden tags</Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleHiddenDragEnd}
          >
            <SortableContext items={hiddenItems} strategy={verticalListSortingStrategy}>
              <div
                style={{ border: '1px solid #f0f0f0', borderRadius: 4, opacity: 0.7 }}
                data-testid="sortable-list-hidden-tags"
                aria-label="Hidden tags"
              >
                {hiddenItems.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Col>
      </Row>
    </Card>
  );
}
