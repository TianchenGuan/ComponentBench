'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-v2-T35
 * AntD: Drawer board to hidden far-right column
 *
 * Drawer with horizontally scrollable Kanban: move OPS-14 to Blocked, then Save board (drawer closes).
 * success_trigger: card_ops_14 in blocked, saved, overlay_open false.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Typography, Button, Drawer, Alert } from 'antd';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../../types';
import { isCardInColumn, serializeBoardState } from '../../types';

const { Text } = Typography;

const INITIAL: KanbanBoardState = {
  backlog: [
    { id: 'card_ops_11', title: 'OPS-11 Configure alerts' },
    { id: 'card_ops_12', title: 'OPS-12 Review logs' },
  ],
  todo: [
    { id: 'card_ops_13', title: 'OPS-13 Setup monitoring' },
    { id: 'card_ops_14', title: 'OPS-14 Update status page' },
    { id: 'card_ops_15', title: 'OPS-15 Document runbook' },
  ],
  in_progress: [
    { id: 'card_ops_16', title: 'OPS-16 Deploy fix' },
    { id: 'card_ops_19', title: 'OPS-19 Patch queue' },
  ],
  review: [
    { id: 'card_ops_20', title: 'OPS-20 QA sign-off' },
    { id: 'card_ops_21', title: 'OPS-21 Rollback drill' },
  ],
  done: [
    { id: 'card_ops_17', title: 'OPS-17 Incident resolved' },
    { id: 'card_ops_18', title: 'OPS-18 Postmortem complete' },
  ],
  blocked: [{ id: 'card_ops_22', title: 'OPS-22 Vendor outage' }],
};

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
  { id: 'blocked', title: 'Blocked' },
] as const;

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        style={{
          marginBottom: 6,
          cursor: isDragging ? 'grabbing' : 'grab',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
        bodyStyle={{ padding: 8 }}
      >
        <Text strong style={{ fontSize: 12 }}>
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '0 0 148px',
        minWidth: 148,
        padding: 8,
        background: isOver ? 'rgba(24,144,255,0.15)' : 'rgba(255,255,255,0.04)',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#1890ff' : 'rgba(255,255,255,0.12)'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 72 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T35({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<KanbanBoardState>(() => structuredClone(INITIAL));
  const [committed, setCommitted] = useState<KanbanBoardState>(() => structuredClone(INITIAL));
  const successFired = useRef(false);

  const dirty = serializeBoardState(draft) !== serializeBoardState(committed);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (successFired.current) return;
    if (!open && isCardInColumn(committed, 'card_ops_14', 'blocked')) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, committed, onSuccess]);

  const findContainer = useCallback(
    (id: string, state: KanbanBoardState): string | undefined => {
      if (COLUMNS.some((c) => c.id === id)) return id;
      for (const [columnId, cards] of Object.entries(state)) {
        if (cards.some((card) => card.id === id)) return columnId;
      }
      return undefined;
    },
    [],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    setDraft((prev) => {
      const activeContainer = findContainer(active.id as string, prev);
      const overContainer = findContainer(over.id as string, prev) || (over.id as string);
      if (!activeContainer || !overContainer || activeContainer === overContainer) return prev;
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex((card) => card.id === active.id);
      const activeCard = activeCards[activeIndex];
      activeCards.splice(activeIndex, 1);
      const overIndex = overCards.findIndex((card) => card.id === over.id);
      if (overIndex === -1) overCards.push(activeCard);
      else overCards.splice(overIndex, 0, activeCard);
      return { ...prev, [activeContainer]: activeCards, [overContainer]: overCards };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    setDraft((prev) => {
      const activeContainer = findContainer(active.id as string, prev);
      const overContainer = findContainer(over.id as string, prev);
      if (!activeContainer || !overContainer) return prev;
      if (activeContainer === overContainer) {
        const cards = prev[activeContainer];
        const oldIndex = cards.findIndex((card) => card.id === active.id);
        const newIndex = cards.findIndex((card) => card.id === over.id);
        if (oldIndex !== newIndex) {
          return { ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) };
        }
      }
      return prev;
    });
  };

  const openDrawer = () => {
    setDraft(structuredClone(committed));
    setOpen(true);
  };

  const saveBoard = () => {
    setCommitted(structuredClone(draft));
    setOpen(false);
  };

  let activeCard: KanbanCard | null = null;
  if (activeId) {
    for (const col of COLUMNS) {
      const found = (draft[col.id] || []).find((c) => c.id === activeId);
      if (found) {
        activeCard = found;
        break;
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ padding: 8, maxWidth: 720 }}>
        <Card size="small" style={{ marginBottom: 10 }} bordered={false}>
          <Text strong>Incident INC-8831</Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 6 }}>
            Customer impact: elevated 5xx · Bridge in 12m · Comms template #4
          </Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
            Runbook links, paging policy, and last deploy SHA shown for noise / clutter.
          </Text>
        </Card>
        <Button type="primary" size="small" onClick={openDrawer} data-testid="open-incident-board-btn">
          Open incident board
        </Button>

        <Drawer
          title="Incident board"
          placement="right"
          width={420}
          open={open}
          onClose={() => setOpen(false)}
          destroyOnClose={false}
          styles={{ body: { padding: 12 } }}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={saveBoard} data-testid="save-board">
                Save board
              </Button>
            </div>
          }
          data-testid="incident-board-drawer"
        >
          {dirty ? (
            <Alert type="warning" showIcon style={{ marginBottom: 8 }} message="Draft — save to commit" />
          ) : null}
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            Scroll horizontally inside the board to reach Blocked.
          </Text>
          <div
            data-testid="kanban-board"
            data-board-id="incident_board_drawer"
            data-instance-label="Incident board (drawer)"
            style={{ overflowX: 'auto', paddingBottom: 6, maxWidth: '100%' }}
          >
            <div style={{ display: 'flex', gap: 8, minWidth: 6 * 148 + 5 * 8 }}>
              {COLUMNS.map((col) => (
                <KanbanColumn key={col.id} column={col} cards={draft[col.id] || []} />
              ))}
            </div>
          </div>
        </Drawer>
      </div>

      <DragOverlay>
        {activeCard ? (
          <Card size="small" style={{ cursor: 'grabbing', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
            <Text strong style={{ fontSize: 12 }}>
              {activeCard.title}
            </Text>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
