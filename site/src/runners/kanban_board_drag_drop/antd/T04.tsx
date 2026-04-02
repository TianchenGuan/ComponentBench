'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T04
 * Task Name: Match a reference order in the Review column
 *
 * Setup Description:
 * The page shows one Kanban board inside an Ant Design Card with columns:
 * "To do", "In progress", "Review", "Done".
 * To the right of the board header, there is a small static panel titled
 * "Reference (Review)" that lists the correct top-to-bottom order for the Review column.
 *
 * The Review column starts in the wrong order:
 *   - "PR-17 Refactor date utils"
 *   - "PR-12 Add loading skeleton"
 *   - "PR-19 Remove dead code"
 *
 * Success: Review column order is PR-12, PR-17, PR-19
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Divider } from 'antd';
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
import { checkColumnOrder } from '../types';

const { Text } = Typography;

const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_pr_20', title: 'PR-20 Fix typos' },
  ],
  in_progress: [
    { id: 'card_pr_21', title: 'PR-21 Update deps' },
  ],
  review: [
    { id: 'card_pr_17', title: 'PR-17 Refactor date utils' },
    { id: 'card_pr_12', title: 'PR-12 Add loading skeleton' },
    { id: 'card_pr_19', title: 'PR-19 Remove dead code' },
  ],
  done: [
    { id: 'card_pr_10', title: 'PR-10 Initial setup' },
  ],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

// Target order for Review column
const targetReviewOrder = ['card_pr_12', 'card_pr_17', 'card_pr_19'];

function SortableCard({ card }: { card: KanbanCard }) {
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
          border: '1px solid #f0f0f0',
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
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: Review column matches target order
  useEffect(() => {
    if (successFired.current) return;
    if (checkColumnOrder(boardState, 'review', targetReviewOrder)) {
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
      title="PR Review Board"
      style={{ width: 900 }}
      extra={
        <div
          style={{
            background: '#f0f5ff',
            border: '1px solid #adc6ff',
            borderRadius: 6,
            padding: '8px 12px',
            marginRight: 8,
          }}
          data-testid="reference-panel"
          data-ref-id="ref_review_v1"
          data-ordered-card-ids="card_pr_12,card_pr_17,card_pr_19"
        >
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            Reference (Review)
          </Text>
          <ol style={{ margin: 0, paddingLeft: 16, fontSize: 11 }}>
            <li>PR-12 Add loading skeleton</li>
            <li>PR-17 Refactor date utils</li>
            <li>PR-19 Remove dead code</li>
          </ol>
        </div>
      }
      data-testid="kanban-board"
      data-board-id="primary"
    >
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
                border: '1px solid #1890ff',
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
