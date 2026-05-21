'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T10
 * Task Name: AntD: Reorder compact table rows and apply
 *
 * Setup Description:
 * Scene is a **table-cell style** configuration panel embedded in the bottom-right of the viewport.
 *
 * Layout details (table_cell, compact, small):
 * - A small card titled **Table settings** contains a compact table labeled **Column order**.
 * - Each table row represents one column and is draggable via a small handle in the first column.
 *
 * Initial row order (top → bottom):
 * Title, Priority, Assignee, Due date, Status.
 *
 * Table columns:
 * - Drag handle (icon-only) — draggable target
 * - Column name (text)
 * - Visible (checkbox) — distractor; does not affect success
 *
 * Commit behavior:
 * - Dragging reorders rows visually, but changes are not committed until the **Apply** button (bottom-right of the card) is clicked.
 * - A small toast "Applied" appears after Apply.
 *
 * Distractors (clutter=medium):
 * - A dropdown "Density" above the table (not required).
 * - A "Reset to default" link next to Apply (not required).
 *
 * Mixed guidance:
 * - Above the table, a small preview strip shows the requested target order as labeled chips (Status → Assignee → Due date → Priority → Title), matching the instruction text.
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Status, Assignee, Due date, Priority, Title.
 * Changes must be committed by activating 'Apply'.
 *
 * Theme: light, Spacing: compact, Layout: table_cell, Placement: bottom_right, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Checkbox, Select, Typography, Space, message, Tag } from 'antd';
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

const { Text, Link } = Typography;

interface ColumnItem {
  id: string;
  label: string;
  visible: boolean;
}

const initialItems: ColumnItem[] = [
  { id: 'title', label: 'Title', visible: true },
  { id: 'priority', label: 'Priority', visible: true },
  { id: 'assignee', label: 'Assignee', visible: true },
  { id: 'due-date', label: 'Due date', visible: true },
  { id: 'status', label: 'Status', visible: true },
];

const targetOrder = ['status', 'assignee', 'due-date', 'priority', 'title'];
const targetLabels = ['Status', 'Assignee', 'Due date', 'Priority', 'Title'];

function SortableTableRow({ item, onVisibilityChange }: { item: ColumnItem; onVisibilityChange: (id: string, visible: boolean) => void }) {
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
    <tr ref={setNodeRef} style={style} data-testid={`sortable-item-${item.id}`}>
      <td style={{ padding: '4px 8px', width: 30 }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
          <HolderOutlined style={{ color: '#999', fontSize: 10 }} />
        </div>
      </td>
      <td style={{ padding: '4px 8px', fontSize: 12 }}>{item.label}</td>
      <td style={{ padding: '4px 8px', textAlign: 'center' }}>
        <Checkbox
          checked={item.visible}
          onChange={(e) => onVisibilityChange(item.id, e.target.checked)}
        />
      </td>
    </tr>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<ColumnItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<ColumnItem[]>(initialItems);
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

  const handleVisibilityChange = (id: string, visible: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, visible } : item));
  };

  const handleApply = () => {
    setCommittedItems([...items]);
    message.success('Applied');
  };

  const handleReset = () => {
    setItems([...initialItems]);
  };

  return (
    <Card
      title="Table settings"
      size="small"
      style={{ width: 300 }}
      data-testid="table-settings-card"
    >
      <div style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 11, color: '#999' }}>Density</Text>
        <Select
          defaultValue="comfortable"
          size="small"
          style={{ width: '100%', marginTop: 4 }}
          options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]}
        />
      </div>

      {/* Target order preview */}
      <div style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Target order:</Text>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {targetLabels.map((label, i) => (
            <React.Fragment key={label}>
              <Tag style={{ fontSize: 10, margin: 0 }}>{label}</Tag>
              {i < targetLabels.length - 1 && <span style={{ color: '#999', fontSize: 10 }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Text strong style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>Column order</Text>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f0f0f0', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ padding: '4px 8px', width: 30 }}></th>
                <th style={{ padding: '4px 8px', textAlign: 'left', fontSize: 11 }}>Column</th>
                <th style={{ padding: '4px 8px', textAlign: 'center', fontSize: 11 }}>Visible</th>
              </tr>
            </thead>
            <tbody data-testid="sortable-list-column-order">
              {items.map((item) => (
                <SortableTableRow
                  key={item.id}
                  item={item}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

      <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
        <Link style={{ fontSize: 11 }} onClick={handleReset}>Reset to default</Link>
        <Button type="primary" size="small" onClick={handleApply}>Apply</Button>
      </Space>
    </Card>
  );
}
