'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T05
 * Task Name: Open a modal board and move a card
 *
 * Setup Description:
 * The page contains a primary Ant Design Button labeled "Open Sprint Board".
 * Clicking it opens an Ant Design Modal titled "Sprint Board".
 * Inside the modal is the Kanban board (the only interactive instance).
 * The modal board has four columns: "Backlog", "To do", "Review", "Done".
 *
 * Initial state: the card "DEP-7 Deploy to staging" is in "To do" column.
 *
 * Success: Card DEP-7 is in "Review" column within the modal's Kanban board.
 * Theme: light, Spacing: comfortable, Layout: modal_flow, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Modal } from 'antd';
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
import { isCardInColumn } from '../types';

const { Text } = Typography;

const initialState: KanbanBoardState = {
  backlog: [
    { id: 'card_dep_5', title: 'DEP-5 Configure staging' },
    { id: 'card_dep_6', title: 'DEP-6 Setup secrets' },
  ],
  todo: [
    { id: 'card_dep_7', title: 'DEP-7 Deploy to staging' },
    { id: 'card_dep_8', title: 'DEP-8 Run smoke tests' },
  ],
  review: [
    { id: 'card_dep_9', title: 'DEP-9 Check metrics' },
  ],
  done: [
    { id: 'card_dep_10', title: 'DEP-10 Notify team' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

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
        minWidth: 150,
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

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: DEP-7 in "Review" column
  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_dep_7', 'review')) {
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
    <div>
      {/* Background preview (faint, non-interactive) */}
      <div
        style={{
          opacity: 0.3,
          pointerEvents: 'none',
          marginBottom: 24,
        }}
      >
        <Card title="Sprint Board (Preview)" style={{ width: 700 }}>
          <Text type="secondary">Open the modal to interact with the board</Text>
        </Card>
      </div>

      <Button
        type="primary"
        size="large"
        onClick={() => setModalOpen(true)}
        data-testid="open-sprint-board-btn"
      >
        Open Sprint Board
      </Button>

      <Modal
        title="Sprint Board"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        data-testid="sprint-board-modal"
      >
        <div data-testid="kanban-board" data-board-id="sprint_modal">
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
        </div>
      </Modal>
    </div>
  );
}
