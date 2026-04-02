'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T06
 * Task Name: AntD: Compact small login-method order
 *
 * Setup Description:
 * Layout is a **settings panel** with a left sidebar (non-interactive links) and a main content area.
 * In the main content area there is a compact card titled **Security settings**.
 *
 * Target component:
 * - A single sortable list labeled **Login methods** (instances=1).
 * - Spacing mode is **compact** and the component scale is **small**: rows have reduced padding and the drag handle icon is smaller than default.
 *
 * Initial list order (top → bottom):
 * Email, Password, Two-factor authentication, Devices, Sessions.
 *
 * Row structure:
 * - Small drag handle icon on the far left
 * - Label text
 * - A right-aligned "Required" / "Optional" tag (non-clickable)
 *
 * Distractors (clutter=low):
 * - Two toggles above the list: "Allow password reset" and "Remember this device" (not required).
 * - An inline help link under the list (not required).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: Email, Two-factor authentication, Password, Devices, Sessions.
 *
 * Theme: light, Spacing: compact, Layout: settings_panel, Placement: center, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Tag, Switch, Typography, Layout } from 'antd';
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

const { Sider, Content } = Layout;
const { Text, Link } = Typography;

interface LoginMethodItem {
  id: string;
  label: string;
  tag: 'Required' | 'Optional';
}

const initialItems: LoginMethodItem[] = [
  { id: 'email', label: 'Email', tag: 'Required' },
  { id: 'password', label: 'Password', tag: 'Required' },
  { id: 'two-factor', label: 'Two-factor authentication', tag: 'Optional' },
  { id: 'devices', label: 'Devices', tag: 'Optional' },
  { id: 'sessions', label: 'Sessions', tag: 'Optional' },
];

const targetOrder = ['email', 'two-factor', 'password', 'devices', 'sessions'];

function SortableRow({ item }: { item: LoginMethodItem }) {
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
    padding: '4px 8px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`sortable-item-${item.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'grab' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HolderOutlined style={{ color: '#999', fontSize: 10 }} />
          <span style={{ fontSize: 12 }}>{item.label}</span>
        </div>
        <Tag color={item.tag === 'Required' ? 'red' : 'default'} style={{ fontSize: 10 }}>
          {item.tag}
        </Tag>
      </div>
    </div>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<LoginMethodItem[]>(initialItems);
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

  const sidebarItems = ['Account', 'Security', 'Privacy', 'Notifications'];

  return (
    <Layout style={{ minHeight: 400, background: '#f5f5f5' }}>
      <Sider width={150} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '12px 16px' }}>
          {sidebarItems.map((item, i) => (
            <div
              key={item}
              style={{
                padding: '6px 0',
                fontSize: 12,
                color: i === 1 ? '#1677ff' : '#666',
                fontWeight: i === 1 ? 500 : 400,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Sider>
      <Content style={{ padding: 16 }}>
        <Card
          title="Security settings"
          size="small"
          style={{ maxWidth: 350 }}
          data-testid="security-settings-card"
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 12 }}>Allow password reset</Text>
              <Switch size="small" defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12 }}>Remember this device</Text>
              <Switch size="small" />
            </div>
          </div>

          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Login methods</Text>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div
                style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}
                data-testid="sortable-list-login-methods"
              >
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Link style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
            Learn more about login methods
          </Link>
        </Card>
      </Content>
    </Layout>
  );
}
