'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-v2-T34
 * AntD: Engineering board only with overlapping title and local save
 *
 * Two boards (Marketing / Engineering). Move Engineering "Prepare demo" to To do; save via
 * Save Engineering board. Marketing Prepare demo must stay in backlog on committed state.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Typography, Button, Alert } from 'antd';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
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

const M_INITIAL: KanbanBoardState = {
  backlog: [{ id: 'card_prepare_demo_mkt', title: 'Prepare demo' }],
  todo: [{ id: 'card_mkt_2', title: 'MKT-2 Email blast' }],
  in_progress: [{ id: 'card_mkt_3', title: 'MKT-3 Landing page' }],
  done: [{ id: 'card_mkt_4', title: 'MKT-4 Analytics' }],
};

const E_INITIAL: KanbanBoardState = {
  backlog: [{ id: 'card_eng_1', title: 'ENG-1 API hardening' }],
  todo: [{ id: 'card_eng_2', title: 'ENG-2 Latency budget' }],
  in_progress: [
    { id: 'card_prepare_demo_eng', title: 'Prepare demo' },
    { id: 'card_eng_4', title: 'ENG-4 Cache layer' },
  ],
  done: [{ id: 'card_eng_5', title: 'ENG-5 Smoke suite' }],
};

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
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
        style={{ marginBottom: 6, cursor: 'grab', border: '1px solid #f0f0f0' }}
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
        flex: '0 0 128px',
        minWidth: 128,
        padding: 6,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 64 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SingleBoard({
  dndId,
  title,
  boardKey,
  state,
  sensors,
  onDragStart,
  onDragOver,
  onDragEnd,
  activeId,
}: {
  dndId: string;
  title: string;
  boardKey: string;
  state: KanbanBoardState;
  sensors: ReturnType<typeof useSensors>;
  onDragStart: (e: DragStartEvent) => void;
  onDragOver: (e: DragOverEvent) => void;
  onDragEnd: (e: DragEndEvent) => void;
  activeId: string | null;
}) {
  const activeCard = activeId ? Object.values(state).flat().find((c) => c.id === activeId) : null;
  return (
    <Card
      size="small"
      title={title}
      style={{ flex: 1, minWidth: 0 }}
      bodyStyle={{ padding: 8 }}
      data-testid={`kanban-board-${boardKey}`}
      data-board-id={boardKey}
      data-instance-label={title}
    >
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {COLUMNS.map((col) => (
            <KanbanColumn key={`${dndId}-${col.id}`} column={col} cards={state[col.id] || []} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <Card size="small" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <Text strong style={{ fontSize: 12 }}>
                {activeCard.title}
              </Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}

export default function T34({ onSuccess }: TaskComponentProps) {
  const [mDraft, setMDraft] = useState<KanbanBoardState>(() => structuredClone(M_INITIAL));
  const [eDraft, setEDraft] = useState<KanbanBoardState>(() => structuredClone(E_INITIAL));
  const [mCommitted, setMCommitted] = useState<KanbanBoardState>(() => structuredClone(M_INITIAL));
  const [eCommitted, setECommitted] = useState<KanbanBoardState>(() => structuredClone(E_INITIAL));
  const [mActiveId, setMActiveId] = useState<string | null>(null);
  const [eActiveId, setEActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const eDirty = serializeBoardState(eDraft) !== serializeBoardState(eCommitted);
  const mDirty = serializeBoardState(mDraft) !== serializeBoardState(mCommitted);

  useEffect(() => {
    if (successFired.current) return;
    if (
      isCardInColumn(eCommitted, 'card_prepare_demo_eng', 'todo') &&
      isCardInColumn(mCommitted, 'card_prepare_demo_mkt', 'backlog')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [eCommitted, mCommitted, onSuccess]);

  const findContainer = useCallback((id: string, state: KanbanBoardState): string | undefined => {
    if (COLUMNS.some((c) => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(state)) {
      if (cards.some((card) => card.id === id)) return columnId;
    }
    return undefined;
  }, []);

  const makeHandlers = (
    setState: React.Dispatch<React.SetStateAction<KanbanBoardState>>,
    setActive: React.Dispatch<React.SetStateAction<string | null>>,
  ) => ({
    onDragStart: (e: DragStartEvent) => setActive(e.active.id as string),
    onDragOver: (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      setState((prev) => {
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
    },
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      setActive(null);
      if (!over) return;
      setState((prev) => {
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
    },
  });

  const m = makeHandlers(setMDraft, setMActiveId);
  const e = makeHandlers(setEDraft, setEActiveId);

  return (
    <div style={{ padding: 8, maxWidth: 980 }}>
      <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
        Delivery dashboard
      </Text>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <SingleBoard
          dndId="kanban-marketing"
          title="Marketing"
          boardKey="marketing"
          state={mDraft}
          sensors={sensors}
          onDragStart={m.onDragStart}
          onDragOver={m.onDragOver}
          onDragEnd={m.onDragEnd}
          activeId={mActiveId}
        />
        <SingleBoard
          dndId="kanban-engineering"
          title="Engineering"
          boardKey="engineering"
          state={eDraft}
          sensors={sensors}
          onDragStart={e.onDragStart}
          onDragOver={e.onDragOver}
          onDragEnd={e.onDragEnd}
          activeId={eActiveId}
        />
      </div>
      {(mDirty || eDirty) && (
        <Alert type="info" showIcon style={{ marginTop: 10, fontSize: 12 }} message="Draft changes — save per board" />
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
        <Button
          size="small"
          disabled={!mDirty}
          onClick={() => setMCommitted(structuredClone(mDraft))}
          data-testid="save-marketing-board"
        >
          Save Marketing board
        </Button>
        <Button
          type="primary"
          size="small"
          disabled={!eDirty}
          onClick={() => setECommitted(structuredClone(eDraft))}
          data-testid="save-engineering-board"
        >
          Save Engineering board
        </Button>
      </div>
    </div>
  );
}
