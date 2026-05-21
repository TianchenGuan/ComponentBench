'use client';

/**
 * Task ID: drag_drop_between_lists-antd-v2-T19
 * Dark drawer; scrollable Available engineers; Zoe Martinez to top of On-call; Save rotation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Drawer, List, Typography } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, DraggableItem } from '../../types';
import { checkExactOrder } from '../../types';

const { Text } = Typography;

const PREFIX = 'esc';

const AVAILABLE_NAMES = [
  'Aiden Ross',
  'Ben Patel',
  'Chris Johnson',
  'Dana Kim',
  'Eli Nguyen',
  'Fatima Ali',
  'Grace Liu',
  'Hiro Tanaka',
  'Ivy Brooks',
  'Mina Hassan',
  'Zoe Martinez',
];

function makeAvailableItems(): DraggableItem[] {
  return AVAILABLE_NAMES.map((label) => ({
    id: `eng-${label.toLowerCase().replace(/\s+/g, '-')}`,
    label,
  }));
}

type PairState = { available: DraggableItem[]; oncall: DraggableItem[] };

const initialPair: PairState = {
  available: makeAvailableItems(),
  oncall: [
    { id: 'eng-ava-chen', label: 'Ava Chen' },
    { id: 'eng-leo-garcia', label: 'Leo Garcia' },
  ],
};

const targetState: Record<string, string[]> = {
  'Available engineers': [
    'Aiden Ross',
    'Ben Patel',
    'Chris Johnson',
    'Dana Kim',
    'Eli Nguyen',
    'Fatima Ali',
    'Grace Liu',
    'Hiro Tanaka',
    'Ivy Brooks',
    'Mina Hassan',
  ],
  'On-call this week': ['Zoe Martinez', 'Ava Chen', 'Leo Garcia'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <List.Item
      ref={setNodeRef}
      style={{ ...style, padding: '4px 8px', borderBottom: '1px solid #303030' }}
      {...attributes}
      data-testid={`dnd-item-${item.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <span
          ref={setActivatorNodeRef}
          {...listeners}
          style={{ cursor: 'grab', touchAction: 'none', color: '#888', display: 'inline-flex' }}
        >
          <HolderOutlined />
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{item.label}</span>
      </div>
    </List.Item>
  );
}

function DroppableColumn({
  id,
  title,
  items,
  scrollAvailable,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  scrollAvailable?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
        {title}
      </Text>
      <div
        ref={setNodeRef}
        style={{
          border: `1px dashed ${isOver ? '#177ddc' : '#434343'}`,
          borderRadius: 4,
          padding: 4,
          minHeight: scrollAvailable ? 168 : 120,
          maxHeight: scrollAvailable ? 168 : undefined,
          overflowY: scrollAvailable ? 'auto' : 'visible',
          background: isOver ? 'rgba(23,125,220,0.12)' : '#1f1f1f',
        }}
        data-testid={`dnd-container-${id}`}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <List
            size="small"
            dataSource={items}
            locale={{ emptyText: 'Drop here' }}
            renderItem={(item) => <SortableItem key={item.id} item={item} />}
          />
        </SortableContext>
      </div>
    </div>
  );
}

export default function T19({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PairState>(initialPair);
  const [committed, setCommitted] = useState<PairState>(initialPair);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: UniqueIdentifier): keyof PairState | undefined => {
    const sid = String(id);
    if (sid === `${PREFIX}-available`) return 'available';
    if (sid === `${PREFIX}-oncall`) return 'oncall';
    if (draft.available.some((i) => i.id === sid)) return 'available';
    if (draft.oncall.some((i) => i.id === sid)) return 'oncall';
    return undefined;
  };

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const ac = findContainer(active.id);
    let oc = findContainer(over.id);
    if (!oc && String(over.id).startsWith(PREFIX)) {
      const r = String(over.id).replace(`${PREFIX}-`, '');
      if (r === 'available' || r === 'oncall') oc = r;
    }
    if (!ac || !oc || ac === oc) return;

    setDraft((prev) => {
      const aItems = [...prev[ac]];
      const oItems = [...prev[oc]];
      const ai = aItems.findIndex((i) => i.id === active.id);
      if (ai === -1) return prev;
      const [moved] = aItems.splice(ai, 1);
      const oi = oItems.findIndex((i) => i.id === over.id);
      if (oi === -1) oItems.push(moved);
      else oItems.splice(oi, 0, moved);
      return { ...prev, [ac]: aItems, [oc]: oItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const ac = findContainer(active.id);
    const oc = findContainer(over.id);
    if (!ac || !oc || ac !== oc) return;
    const items = [...draft[ac]];
    const oi = items.findIndex((i) => i.id === active.id);
    const ni = items.findIndex((i) => i.id === over.id);
    if (oi !== -1 && ni !== -1 && oi !== ni) {
      setDraft((prev) => ({ ...prev, [ac]: arrayMove(items, oi, ni) }));
    }
  };

  const activeItem = activeId
    ? [...draft.available, ...draft.oncall].find((i) => i.id === activeId)
    : null;

  useEffect(() => {
    if (successFired.current || open) return;
    const containers = {
      'Available engineers': committed.available,
      'On-call this week': committed.oncall,
    };
    if (checkExactOrder(containers, targetState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, open, onSuccess]);

  const save = () => {
    setCommitted({
      available: draft.available.map((i) => ({ ...i })),
      oncall: draft.oncall.map((i) => ({ ...i })),
    });
    setOpen(false);
  };

  return (
    <div style={{ padding: 12 }}>
      <Button
        type="primary"
        onClick={() => {
          setDraft({
            available: committed.available.map((i) => ({ ...i })),
            oncall: committed.oncall.map((i) => ({ ...i })),
          });
          setOpen(true);
        }}
        data-testid="edit-escalation-open"
      >
        Edit escalation recipients
      </Button>

      <Drawer
        title="Escalation recipients"
        placement="right"
        width={480}
        open={open}
        onClose={() => setOpen(false)}
        styles={{
          body: { background: '#141414' },
          header: { background: '#1f1f1f', borderBottom: '1px solid #303030' },
          footer: { background: '#1f1f1f', borderTop: '1px solid #303030' },
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={save} data-testid="save-rotation">
              Save rotation
            </Button>
          </div>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 10, fontSize: 12, color: '#a6a6a6' }}>
          Scroll Available engineers to reach engineers lower in the list.
        </Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <DroppableColumn
              id={`${PREFIX}-available`}
              title="Available engineers"
              items={draft.available}
              scrollAvailable
            />
            <DroppableColumn id={`${PREFIX}-oncall`} title="On-call this week" items={draft.oncall} />
          </div>
          <DragOverlay>
            {activeItem ? (
              <div
                style={{
                  padding: '6px 10px',
                  background: '#262626',
                  border: '1px solid #434343',
                  borderRadius: 4,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.45)',
                }}
              >
                <HolderOutlined style={{ color: '#888' }} />
                {activeItem.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Drawer>

      {!open && (
        <Alert
          style={{ marginTop: 12, maxWidth: 480 }}
          type="info"
          message="Committed on-call"
          description={committed.oncall.map((i) => i.label).join(' · ')}
        />
      )}
    </div>
  );
}
