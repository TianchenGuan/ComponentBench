'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-v2-T06
 * AntD: Reorder then discard from the drawer confirmation flow
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, List, Modal, Typography, Space, Card, Alert } from 'antd';
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
import type { TaskComponentProps, SortableItem } from '../../types';
import { arraysEqual } from '../../types';

const { Text, Title } = Typography;

const initialItems: SortableItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'owners', label: 'Owners' },
  { id: 'latency', label: 'Latency' },
  { id: 'error-budget', label: 'Error budget' },
  { id: 'links', label: 'Links' },
];

const baselineOrder = initialItems.map((i) => i.id);

function SortableRow({ item }: { item: SortableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    background: isDragging ? 'rgba(255,255,255,0.08)' : 'transparent',
  };
  return (
    <List.Item ref={setNodeRef} style={style} data-testid={`sidebar-order-item-${item.id}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <button
          type="button"
          aria-label="Drag handle"
          {...attributes}
          {...listeners}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 2,
            cursor: 'grab',
            color: '#888',
            display: 'flex',
          }}
        >
          <HolderOutlined />
        </button>
        <span style={{ fontSize: 12 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<SortableItem[]>(initialItems);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const discardedViaFlow = useRef(false);
  const hadDirtyDraft = useRef(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const isDirty = !arraysEqual(
    items.map((i) => i.id),
    baselineOrder
  );

  useEffect(() => {
    if (isDirty) hadDirtyDraft.current = true;
  }, [isDirty]);

  useEffect(() => {
    if (successFired.current) return;
    const order = items.map((i) => i.id);
    if (
      discardedViaFlow.current &&
      hadDirtyDraft.current &&
      !drawerOpen &&
      !confirmCloseOpen &&
      arraysEqual(order, baselineOrder)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [items, drawerOpen, confirmCloseOpen, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((list) => {
        const oi = list.findIndex((i) => i.id === active.id);
        const ni = list.findIndex((i) => i.id === over.id);
        return arrayMove(list, oi, ni);
      });
    }
  };

  const requestCloseDrawer = () => {
    if (isDirty) {
      setConfirmCloseOpen(true);
    } else {
      setDrawerOpen(false);
    }
  };

  const discardChanges = () => {
    discardedViaFlow.current = true;
    setItems([...initialItems]);
    setConfirmCloseOpen(false);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 12 }}>
      <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 12 }}>
        <Alert type="warning" message="Active incident" description="Latency spike in us-east" showIcon />
        <Card size="small" styles={{ body: { padding: 8 } }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Error budget burn: 42% (24h)
          </Text>
        </Card>
      </Space>
      <Title level={5} style={{ marginTop: 0 }}>
        Incident overview
      </Title>
      <Button type="primary" onClick={() => setDrawerOpen(true)} data-testid="edit-incident-sidebar">
        Edit incident sidebar
      </Button>

      <Drawer
        title="Incident sidebar order"
        placement="right"
        width={340}
        open={drawerOpen}
        onClose={requestCloseDrawer}
        data-testid="incident-sidebar-drawer"
        footer={
          <div>
            {isDirty ? (
              <Text type="warning" style={{ fontSize: 12 }} data-testid="unsaved-changes-banner">
                Unsaved changes
              </Text>
            ) : (
              <Text type="secondary" style={{ fontSize: 12 }}>
                No pending edits
              </Text>
            )}
          </div>
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <List
              size="small"
              dataSource={items}
              renderItem={(item) => <SortableRow key={item.id} item={item} />}
              data-testid="sortable-incident-sidebar"
            />
          </SortableContext>
        </DndContext>
      </Drawer>

      <Modal
        title="Discard sidebar changes?"
        open={confirmCloseOpen}
        onCancel={() => setConfirmCloseOpen(false)}
        footer={null}
        data-testid="discard-confirm-modal"
      >
        <Text style={{ display: 'block', marginBottom: 16 }}>
          You have reordered items. Keep editing or discard and restore the saved order.
        </Text>
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={() => setConfirmCloseOpen(false)} data-testid="keep-editing-button">
            Keep editing
          </Button>
          <Button danger type="primary" onClick={discardChanges} data-testid="discard-changes-button">
            Discard changes
          </Button>
        </Space>
      </Modal>
    </div>
  );
}
