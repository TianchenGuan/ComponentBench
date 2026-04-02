'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T07
 * Task Name: Move a card and click Apply changes
 *
 * Setup Description:
 * The page is in DARK theme. A single Kanban board is shown in a centered card titled
 * "Design Tasks". The board has four columns: "To do", "In progress", "Review", "Done".
 *
 * Initial state: "DESIGN-5 Update icons" is in the "Review" column.
 *
 * Feedback behavior: dragging a card creates an "Unsaved changes" banner and reveals
 * two buttons: "Apply changes" (primary) and "Cancel".
 * The board does NOT commit until "Apply changes" is clicked.
 *
 * Success: DESIGN-5 is in "Done" AND changes have been applied (committed state).
 * Theme: DARK, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Space, Alert, ConfigProvider, theme } from 'antd';
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
  todo: [
    { id: 'card_design_1', title: 'DESIGN-1 Create wireframes' },
  ],
  in_progress: [
    { id: 'card_design_2', title: 'DESIGN-2 Design system' },
    { id: 'card_design_3', title: 'DESIGN-3 Color palette' },
  ],
  review: [
    { id: 'card_design_4', title: 'DESIGN-4 Typography guide' },
    { id: 'card_design_5', title: 'DESIGN-5 Update icons' },
  ],
  done: [
    { id: 'card_design_6', title: 'DESIGN-6 Logo variants' },
  ],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
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
          background: '#1f1f1f',
          border: '1px solid #303030',
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <Text strong style={{ fontSize: 13, color: '#fff' }}>{card.title}</Text>
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
        minWidth: 170,
        padding: 12,
        background: isOver ? '#1a3a5c' : '#262626',
        borderRadius: 8,
        border: `1px solid ${isOver ? '#1890ff' : '#303030'}`,
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14, color: '#fff' }}>
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

export default function T07({ onSuccess }: TaskComponentProps) {
  const [committedState, setCommittedState] = useState<KanbanBoardState>(
    JSON.parse(JSON.stringify(initialState))
  );
  const [pendingState, setPendingState] = useState<KanbanBoardState>(
    JSON.parse(JSON.stringify(initialState))
  );
  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: DESIGN-5 in "Done" AND committed (not dirty)
  useEffect(() => {
    if (successFired.current) return;
    if (!isDirty && isCardInColumn(committedState, 'card_design_5', 'done')) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedState, isDirty, onSuccess]);

  const handleApply = () => {
    setCommittedState(JSON.parse(JSON.stringify(pendingState)));
    setIsDirty(false);
  };

  const handleCancel = () => {
    setPendingState(JSON.parse(JSON.stringify(committedState)));
    setIsDirty(false);
  };

  const findContainer = (id: string): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(pendingState)) {
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

    setPendingState(prev => {
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
    setIsDirty(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const cards = pendingState[activeContainer];
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);

      if (oldIndex !== newIndex) {
        setPendingState(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
        setIsDirty(true);
      }
    }
  };

  const activeCard = activeId
    ? Object.values(pendingState).flat().find(card => card.id === activeId)
    : null;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ background: '#141414', padding: 24, borderRadius: 8 }}>
        <Card
          title={<span style={{ color: '#fff' }}>Design Tasks</span>}
          style={{ width: 800, background: '#1f1f1f', border: '1px solid #303030' }}
          headStyle={{ background: '#1f1f1f', borderBottom: '1px solid #303030' }}
          data-testid="kanban-board"
          data-board-id="design_tasks"
        >
          {isDirty && (
            <Alert
              message="Unsaved changes"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
              data-testid="unsaved-banner"
            />
          )}
          
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
                  cards={pendingState[column.id] || []}
                />
              ))}
            </div>

            <DragOverlay>
              {activeCard ? (
                <Card
                  size="small"
                  style={{
                    cursor: 'grabbing',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '1px solid #1890ff',
                    background: '#1f1f1f',
                  }}
                >
                  <Text strong style={{ fontSize: 13, color: '#fff' }}>{activeCard.title}</Text>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>

          {isDirty && (
            <div style={{ marginTop: 16, borderTop: '1px solid #303030', paddingTop: 16 }}>
              <Space>
                <Button
                  type="primary"
                  onClick={handleApply}
                  data-testid="apply-changes-btn"
                >
                  Apply changes
                </Button>
                <Button
                  onClick={handleCancel}
                  data-testid="cancel-btn"
                >
                  Cancel
                </Button>
              </Space>
            </div>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}
