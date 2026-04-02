'use client';

/**
 * Task ID: kanban_board_drag_drop-antd-T06
 * Task Name: Move a card on the correct board when two boards are visible
 *
 * Setup Description:
 * The page uses a simple dashboard layout with a header row and two Kanban boards
 * rendered side-by-side:
 *   - Left board is labeled "Marketing"
 *   - Right board is labeled "Engineering" (target instance)
 *
 * Each board has four columns: "Backlog", "To do", "In progress", "Done".
 * Initial state (Engineering board): card "ENG-21 API pagination" starts in "Backlog".
 *
 * Success: On Engineering board, card ENG-21 is in "To do" column.
 * Theme: light, Spacing: comfortable, Layout: dashboard, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
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

const { Text, Title } = Typography;

// Marketing board state
const marketingInitialState: KanbanBoardState = {
  backlog: [
    { id: 'card_mkt_1', title: 'MKT-1 Blog post' },
  ],
  todo: [
    { id: 'card_mkt_2', title: 'MKT-2 Social campaign' },
  ],
  in_progress: [
    { id: 'card_mkt_3', title: 'MKT-3 Newsletter' },
  ],
  done: [
    { id: 'card_mkt_4', title: 'MKT-4 Press release' },
  ],
};

// Engineering board state (target)
const engineeringInitialState: KanbanBoardState = {
  backlog: [
    { id: 'card_eng_20', title: 'ENG-20 Database migration' },
    { id: 'card_eng_21', title: 'ENG-21 API pagination' },
  ],
  todo: [
    { id: 'card_eng_22', title: 'ENG-22 Auth refactor' },
  ],
  in_progress: [
    { id: 'card_eng_23', title: 'ENG-23 Fix memory leak' },
  ],
  done: [
    { id: 'card_eng_24', title: 'ENG-24 Performance tuning' },
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
          marginBottom: 6,
          cursor: 'grab',
          border: '1px solid #f0f0f0',
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <Text style={{ fontSize: 12 }}>{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({
  column,
  cards,
  boardId,
}: {
  column: { id: string; title: string };
  cards: KanbanCard[];
  boardId: string;
}) {
  const droppableId = `${boardId}-${column.id}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 120,
        padding: 8,
        background: isOver ? '#e6f7ff' : '#fafafa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#1890ff' : '#e8e8e8'}`,
        transition: 'all 0.2s',
      }}
      data-testid={`${boardId}-column-${column.id}`}
      data-column-id={column.id}
    >
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        {column.title}
      </Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: 80 }}>
          {cards.map(card => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

interface BoardProps {
  title: string;
  boardId: string;
  boardState: KanbanBoardState;
  setBoardState: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
}

function KanbanBoard({ title, boardId, boardState, setBoardState, activeId, setActiveId }: BoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): string | undefined => {
    // Check if id is a droppable column
    const match = id.match(new RegExp(`^${boardId}-(.+)$`));
    if (match) return match[1];
    
    // Check if id is a card
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
    let overContainer = findContainer(over.id as string);
    
    // If over is a droppable, extract the column id
    const overIdStr = over.id as string;
    if (overIdStr.startsWith(`${boardId}-`)) {
      overContainer = overIdStr.replace(`${boardId}-`, '');
    }

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
      title={title}
      size="small"
      style={{ height: '100%' }}
      data-testid={`kanban-board-${boardId}`}
      data-board-id={boardId}
      data-board-label={title}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={boardState[column.id] || []}
              boardId={boardId}
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
              <Text style={{ fontSize: 12 }}>{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [marketingState, setMarketingState] = useState<KanbanBoardState>(marketingInitialState);
  const [engineeringState, setEngineeringState] = useState<KanbanBoardState>(engineeringInitialState);
  const [activeIdMarketing, setActiveIdMarketing] = useState<string | null>(null);
  const [activeIdEngineering, setActiveIdEngineering] = useState<string | null>(null);
  const successFired = useRef(false);

  // Check success: ENG-21 in Engineering "To do" column
  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(engineeringState, 'card_eng_21', 'todo')) {
      successFired.current = true;
      onSuccess();
    }
  }, [engineeringState, onSuccess]);

  return (
    <div style={{ width: 1100 }}>
      {/* Dashboard header */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Project Dashboard</Title>
        <div style={{ flex: 1 }} />
        <Card size="small" style={{ minWidth: 100 }}>
          <Statistic title="Sprint" value={12} />
        </Card>
        <Card size="small" style={{ minWidth: 100 }}>
          <Statistic title="Tasks" value={18} />
        </Card>
      </div>

      {/* Two boards side by side */}
      <Row gutter={16}>
        <Col span={12}>
          <KanbanBoard
            title="Marketing"
            boardId="marketing"
            boardState={marketingState}
            setBoardState={setMarketingState}
            activeId={activeIdMarketing}
            setActiveId={setActiveIdMarketing}
          />
        </Col>
        <Col span={12}>
          <KanbanBoard
            title="Engineering"
            boardId="engineering"
            boardState={engineeringState}
            setBoardState={setEngineeringState}
            activeId={activeIdEngineering}
            setActiveId={setActiveIdEngineering}
          />
        </Col>
      </Row>
    </div>
  );
}
