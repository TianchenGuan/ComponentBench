'use client';

/**
 * Task ID: drag_drop_sortable_list-antd-v2-T05
 * AntD: Modal reference ranking with handle-only moves
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal, List, Button, Card, Typography, Space } from 'antd';
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
  { id: 'intro', label: 'Intro' },
  { id: 'breakout', label: 'Breakout' },
  { id: 'demo', label: 'Demo' },
  { id: 'wrap-up', label: 'Wrap-up' },
  { id: 'qa', label: 'Q&A' },
];

const referenceLabels = ['Demo', 'Intro', 'Breakout', 'Q&A', 'Wrap-up'];

const targetOrder = ['demo', 'intro', 'breakout', 'qa', 'wrap-up'];

function SortableRow({ item }: { item: SortableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    background: isDragging ? 'rgba(0,0,0,0.04)' : 'transparent',
  };
  return (
    <List.Item ref={setNodeRef} style={style} data-testid={`agenda-item-${item.id}`}>
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
            color: '#999',
            display: 'flex',
          }}
        >
          <HolderOutlined />
        </button>
        <span style={{ fontSize: 13 }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<SortableItem[]>(initialItems);
  const [committedItems, setCommittedItems] = useState<SortableItem[]>(initialItems);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const order = committedItems.map((i) => i.id);
    if (!modalOpen && arraysEqual(order, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedItems, modalOpen, onSuccess]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDraftItems((items) => {
        const oi = items.findIndex((i) => i.id === active.id);
        const ni = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oi, ni);
      });
    }
  };

  const saveOrder = () => {
    setCommittedItems([...draftItems]);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Card size="small" title="Workshop summary" style={{ maxWidth: 400 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Adjust the live agenda order before the session.
        </Text>
        <div style={{ marginTop: 12 }}>
          <Button
            type="primary"
            onClick={() => {
              setDraftItems([...committedItems]);
              setModalOpen(true);
            }}
            data-testid="edit-agenda-order"
          >
            Edit agenda order
          </Button>
        </div>
      </Card>

      <Modal
        title="Workshop agenda"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={480}
        data-testid="workshop-agenda-modal"
      >
        <Space align="start" size="middle" style={{ width: '100%' }} wrap>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Title level={5} style={{ marginTop: 0, fontSize: 14 }}>
              Workshop agenda
            </Title>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={draftItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <List
                  size="small"
                  bordered
                  dataSource={draftItems}
                  renderItem={(item) => <SortableRow key={item.id} item={item} />}
                  data-testid="sortable-workshop-agenda"
                />
              </SortableContext>
            </DndContext>
          </div>
          <Card
            size="small"
            title="Reference order"
            style={{ width: 200 }}
            data-testid="reference-order-panel"
            styles={{ body: { padding: 8 } }}
          >
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              {referenceLabels.map((label, idx) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    padding: '4px 8px',
                    background: '#f5f5f5',
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#1677ff',
                      minWidth: 18,
                    }}
                  >
                    {idx + 1}.
                  </span>
                  {label}
                </div>
              ))}
            </Space>
          </Card>
        </Space>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button type="primary" onClick={saveOrder} data-testid="save-order-button">
            Save order
          </Button>
        </div>
      </Modal>
    </div>
  );
}
