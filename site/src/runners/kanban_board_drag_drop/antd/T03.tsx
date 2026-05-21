'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T03
 * Task Name: Reset the board to its default arrangement
 *
 * Setup Description:
 * The page shows a single Kanban board inside an Ant Design Card. The board header contains
 * two controls on the right:
 *   - "Reset board" (primary for this task)
 *   - "Help" (opens a tooltip; irrelevant)
 * The Kanban board has four columns with multiple cards; it starts in a deliberately
 * modified state (some cards have been moved from their defaults).
 * Pressing "Reset board" immediately restores a known default state (no confirmation dialog).
 *
 * Success: Board matches the stored default snapshot "default_state_v1"
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Space, Tooltip, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
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
import { boardStatesEqual } from '../types';

const { Text } = Typography;

// Default (target) state
const defaultState: KanbanBoardState = {
  backlog: [
    { id: 'card_task_1', title: 'TASK-1 Initialize project' },
    { id: 'card_task_2', title: 'TASK-2 Setup CI/CD' },
  ],
  todo: [
    { id: 'card_task_3', title: 'TASK-3 Write unit tests' },
    { id: 'card_task_4', title: 'TASK-4 Add documentation' },
  ],
  in_progress: [
    { id: 'card_task_5', title: 'TASK-5 Implement API' },
  ],
  done: [
    { id: 'card_task_6', title: 'TASK-6 Design mockups' },
    { id: 'card_task_7', title: 'TASK-7 Review specs' },
  ],
};

// Modified initial state (different from default)
const initialState: KanbanBoardState = {
  backlog: [
    { id: 'card_task_2', title: 'TASK-2 Setup CI/CD' },
  ],
  todo: [
    { id: 'card_task_5', title: 'TASK-5 Implement API' },
    { id: 'card_task_3', title: 'TASK-3 Write unit tests' },
  ],
  in_progress: [
    { id: 'card_task_1', title: 'TASK-1 Initialize project' },
    { id: 'card_task_4', title: 'TASK-4 Add documentation' },
  ],
  done: [
    { id: 'card_task_7', title: 'TASK-7 Review specs' },
    { id: 'card_task_6', title: 'TASK-6 Design mockups' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
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
        minWidth: 180,
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: board matches default state
  useEffect(() => {
    if (successFired.current) return;
    if (boardStatesEqual(boardState, defaultState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [boardState, onSuccess]);

  const handleReset = () => {
    setBoardState(JSON.parse(JSON.stringify(defaultState)));
    messageApi.success('Board reset');
  };

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
    <>
      {contextHolder}
      <Card
        title="Project Board"
        style={{ width: 820 }}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={handleReset}
              data-testid="reset-board-btn"
            >
              Reset board
            </Button>
            <Tooltip title="Drag and drop cards to organize tasks">
              <Button icon={<QuestionCircleOutlined />}>Help</Button>
            </Tooltip>
          </Space>
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
    </>
  );
}
