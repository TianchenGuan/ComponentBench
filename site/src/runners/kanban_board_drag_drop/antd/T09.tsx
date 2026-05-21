'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T09
 * Task Name: Match highlighted cards to a visual reference mini-board
 *
 * Setup Description:
 * The page shows one Kanban board inside an Ant Design Card titled "Weekly Priorities".
 * Above the board (inside the card) is a static "Reference" mini-board showing where
 * three highlighted cards should end up.
 *
 * Three target cards:
 *   - "PM-2 Draft Q2 roadmap" → first card in "To do"
 *   - "QA-12 Smoke test signup" → anywhere in "Review"
 *   - "SEC-9 Rotate API keys" → anywhere in "Done"
 *
 * Initial state: cards are in wrong positions
 *
 * Success: All three cards in correct positions
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Badge, Divider } from 'antd';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../types';
import { isCardInColumn, isCardAtIndex } from '../types';

const { Text } = Typography;

// Highlighted card IDs
const HIGHLIGHTED_CARDS = ['card_pm_2', 'card_qa_12', 'card_sec_9'];

const initialState: KanbanBoardState = {
  backlog: [
    { id: 'card_pm_1', title: 'PM-1 User research' },
    { id: 'card_pm_2', title: 'PM-2 Draft Q2 roadmap' }, // Should be first in To do
  ],
  todo: [
    { id: 'card_qa_11', title: 'QA-11 Test checkout' },
    { id: 'card_sec_9', title: 'SEC-9 Rotate API keys' }, // Should be in Done
  ],
  review: [
    { id: 'card_dev_5', title: 'DEV-5 Fix search' },
  ],
  done: [
    { id: 'card_qa_12', title: 'QA-12 Smoke test signup' }, // Should be in Review
    { id: 'card_dev_3', title: 'DEV-3 Update deps' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card, highlighted }: { card: KanbanCard; highlighted: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

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
          marginBottom: 8,
          cursor: 'grab',
          border: highlighted ? '2px solid #fa8c16' : '1px solid #f0f0f0',
          background: highlighted ? '#fff7e6' : '#fff',
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <Text strong style={{ fontSize: 13 }}>{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({
  column,
  cards,
}: {
  column: { id: string; title: string };
  cards: KanbanCard[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 160,
        padding: 12,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 8,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 100 }}>
          {cards.map(card => (
            <SortableCard
              key={card.id}
              card={card}
              highlighted={HIGHLIGHTED_CARDS.includes(card.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success:
  // - PM-2 is first in "To do"
  // - QA-12 is in "Review"
  // - SEC-9 is in "Done"
  useEffect(() => {
    if (successFired.current) return;
    const pm2First = isCardAtIndex(boardState, 'todo', 'card_pm_2', 0);
    const qa12InReview = isCardInColumn(boardState, 'card_qa_12', 'review');
    const sec9InDone = isCardInColumn(boardState, 'card_sec_9', 'done');
    
    if (pm2First && qa12InReview && sec9InDone) {
      successFired.current = true;
      onSuccess();
    }
  }, [boardState, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(boardState)) {
      if (cards.some(card => card.id === id)) return columnId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setBoardState(prev => {
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex(card => card.id === active.id);
      const activeCard = activeCards[activeIndex];

      activeCards.splice(activeIndex, 1);

      const overIndex = overCards.findIndex(card => card.id === over.id);
      if (overIndex === -1) {
        overCards.push(activeCard);
      } else {
        overCards.splice(overIndex, 0, activeCard);
      }

      return {
        ...prev,
        [activeContainer]: activeCards,
        [overContainer]: overCards,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const cards = boardState[activeContainer];
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);

      if (oldIndex !== newIndex) {
        setBoardState(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeCard = activeId
    ? Object.values(boardState).flat().find(card => card.id === activeId)
    : null;

  return (
    <Card
      title="Weekly Priorities"
      style={{ width: 900 }}
      data-testid="kanban-board"
      data-board-id="weekly_priorities"
    >
      {/* Reference mini-board */}
      <div
        style={{
          background: '#f0f5ff',
          border: '1px solid #adc6ff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
        data-testid="reference-miniboard"
        data-ref-id="ref_miniboard_v2"
      >
        <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
          Reference — Match highlighted cards:
        </Text>
        <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
          <div>
            <Text type="secondary">To do (first):</Text>
            <div style={{ padding: '4px 8px', background: '#fff7e6', border: '1px solid #fa8c16', borderRadius: 4, marginTop: 4 }}>
              PM-2 Draft Q2 roadmap
            </div>
          </div>
          <div>
            <Text type="secondary">Review:</Text>
            <div style={{ padding: '4px 8px', background: '#fff7e6', border: '1px solid #fa8c16', borderRadius: 4, marginTop: 4 }}>
              QA-12 Smoke test signup
            </div>
          </div>
          <div>
            <Text type="secondary">Done:</Text>
            <div style={{ padding: '4px 8px', background: '#fff7e6', border: '1px solid #fa8c16', borderRadius: 4, marginTop: 4 }}>
              SEC-9 Rotate API keys
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={boardState[column.id] || []}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <Card
              size="small"
              style={{
                cursor: 'grabbing',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: HIGHLIGHTED_CARDS.includes(activeCard.id) ? '2px solid #fa8c16' : '1px solid #1890ff',
                background: HIGHLIGHTED_CARDS.includes(activeCard.id) ? '#fff7e6' : '#fff',
              }}
            >
              <Text strong style={{ fontSize: 13 }}>{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
