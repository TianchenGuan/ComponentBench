'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-T08
 * Task Name: AntD: Scrollable drawer list — move 'API Keys' to top
 *
 * Setup Description:
 * Scene uses **drawer flow** in **dark theme**.
 * A right-side drawer is already open when the page loads (no need to open it).
 * The drawer header says **Account settings** and the drawer is anchored to the right side of the viewport.
 *
 * Inside the drawer there are multiple settings sections (clutter=medium):
 * - A couple of toggles ("Enable SSO", "Require MFA") above the list (not required)
 * - A divider, then the target section titled **Sections order**
 * - A help text paragraph below the list (not required)
 *
 * Target component:
 * - One scrollable sortable list labeled **Sections order** with 15 items.
 * - The list is in a fixed-height container; only about 6 items are visible at once, so scrolling inside the list is required.
 *
 * Initial order (top → bottom):
 * Profile, Billing, Invoices, Usage, Team, Roles, Notifications, Security, Sessions, Devices, Integrations, API Keys, Webhooks, Audit log, Danger zone.
 *
 * Dragging behavior:
 * - Items can be reordered by dragging a small handle on the left of each row (handle-only activation).
 * - While dragging, a placeholder gap shows the drop position.
 * - Order updates immediately on drop (no Save button).
 *
 * Success Trigger:
 * Target sortable list order (top → bottom) must be: API Keys, Profile, Billing, Invoices, Usage, Team, Roles, Notifications, Security, Sessions, Devices, Integrations, Webhooks, Audit log, Danger zone.
 *
 * Theme: dark, Spacing: comfortable, Layout: drawer_flow, Placement: top_right
 */

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Switch, Divider, Typography, ConfigProvider, theme } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
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

const { Text, Title } = Typography;

const initialItems: SortableItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'usage', label: 'Usage' },
  { id: 'team', label: 'Team' },
  { id: 'roles', label: 'Roles' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'devices', label: 'Devices' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'api-keys', label: 'API Keys' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'audit-log', label: 'Audit log' },
  { id: 'danger-zone', label: 'Danger zone' },
];

const targetOrder = ['api-keys', 'profile', 'billing', 'invoices', 'usage', 'team', 'roles', 'notifications', 'security', 'sessions', 'devices', 'integrations', 'webhooks', 'audit-log', 'danger-zone'];

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
    opacity: isDragging ? 0.5 : 1,
    padding: '8px 12px',
    borderBottom: '1px solid #303030',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#1f1f1f',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-item-${item.id}`}
    >
      <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
        <HolderOutlined style={{ color: '#666', fontSize: 12 }} />
      </div>
      <span style={{ color: '#fff', fontSize: 14 }}>{item.label}</span>
    </div>
  );
}

function DragOverlayItem({ item }: { item: SortableItem }) {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#262626',
        border: '1px solid #434343',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <HolderOutlined style={{ color: '#666', fontSize: 12 }} />
      <span style={{ color: '#fff', fontSize: 14 }}>{item.label}</span>
    </div>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', minHeight: '100vh', padding: 0 }}>
        <Drawer
          title="Account settings"
          placement="right"
          open={true}
          closable={false}
          mask={false}
          width={380}
          styles={{
            body: { padding: 16 },
            header: { background: '#1f1f1f', borderBottom: '1px solid #303030' },
          }}
          style={{ background: '#1f1f1f' }}
          data-testid="account-settings-drawer"
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: '#fff' }}>Enable SSO</Text>
              <Switch size="small" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>Require MFA</Text>
              <Switch size="small" defaultChecked />
            </div>
          </div>

          <Divider style={{ borderColor: '#303030', margin: '16px 0' }} />

          <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Sections order</Title>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div
                style={{
                  maxHeight: 280,
                  overflowY: 'auto',
                  border: '1px solid #303030',
                  borderRadius: 4,
                }}
                data-testid="sortable-list-sections-order"
              >
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeItem ? <DragOverlayItem item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>

          <Text type="secondary" style={{ fontSize: 12, marginTop: 12, display: 'block' }}>
            Drag items to reorder how sections appear in your account settings.
          </Text>
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
