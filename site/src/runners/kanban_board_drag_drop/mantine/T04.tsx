'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-T04
 * Task Name: Move a card on the correct board when two boards exist
 *
 * Setup Description:
 * Two Mantine Paper panels are displayed in a two-column grid:
 *   - Left panel: "Home"
 *   - Right panel: "Work" (target)
 *
 * Initial state: on the Work board, "WORK-10 Prepare invoice" is in "To do".
 *
 * Success: On Work board, WORK-10 is in "In progress" column.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, Text, Box, Title, Grid } from '@mantine/core';
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

const homeInitialState: KanbanBoardState = {
  todo: [{ id: 'card_home_1', title: 'HOME-1 Groceries' }],
  in_progress: [{ id: 'card_home_2', title: 'HOME-2 Clean' }],
  done: [{ id: 'card_home_3', title: 'HOME-3 Laundry' }],
};

const workInitialState: KanbanBoardState = {
  todo: [
    { id: 'card_work_9', title: 'WORK-9 Review code' },
    { id: 'card_work_10', title: 'WORK-10 Prepare invoice' },
  ],
  in_progress: [{ id: 'card_work_11', title: 'WORK-11 Client call' }],
  done: [{ id: 'card_work_12', title: 'WORK-12 Sent proposal' }],
};

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card shadow="xs" p="xs" mb="xs" style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text size="xs">{card.title}</Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards, boardId }: { column: { id: string; title: string }; cards: KanbanCard[]; boardId: string }) {
  const droppableId = `${boardId}-${column.id}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 100,
        padding: 8,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`${boardId}-column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb="sm">{column.title}</Text>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 60 }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

interface BoardProps {
  title: string;
  boardId: string;
  boardState: KanbanBoardState;
  setBoardState: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
}

function KanbanBoard({ title, boardId, boardState, setBoardState }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const findContainer = (id: string): string | undefined => {
    const match = (id as string).match(new RegExp(`^${boardId}-(.+)$`));
    if (match) return match[1];
    for (const [columnId, cards] of Object.entries(boardState)) {
      if (cards.some(card => card.id === id)) return columnId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    let overContainer = findContainer(over.id as string);
    const overIdStr = over.id as string;
    if (overIdStr.startsWith(`${boardId}-`)) overContainer = overIdStr.replace(`${boardId}-`, '');
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setBoardState(prev => {
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex(card => card.id === active.id);
      const activeCard = activeCards[activeIndex];
      activeCards.splice(activeIndex, 1);
      const overIndex = overCards.findIndex(card => card.id === over.id);
      if (overIndex === -1) overCards.push(activeCard);
      else overCards.splice(overIndex, 0, activeCard);
      return { ...prev, [activeContainer]: activeCards, [overContainer]: overCards };
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
        setBoardState(prev => ({ ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) }));
      }
    }
  };

  const activeCard = activeId ? Object.values(boardState).flat().find(card => card.id === activeId) : null;

  return (
    <Paper shadow="xs" p="md" data-testid={`kanban-board-${boardId}`} data-board-id={boardId} data-board-label={title}>
      <Title order={5} mb="sm">{title}</Title>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box style={{ display: 'flex', gap: 8 }}>
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} boardId={boardId} />)}
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card shadow="md" p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
              <Text size="xs">{activeCard.title}</Text>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [homeState, setHomeState] = useState<KanbanBoardState>(homeInitialState);
  const [workState, setWorkState] = useState<KanbanBoardState>(workInitialState);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(workState, 'card_work_10', 'in_progress')) {
      successFired.current = true;
      onSuccess();
    }
  }, [workState, onSuccess]);

  return (
    <Grid gutter="md" style={{ width: 700 }}>
      <Grid.Col span={6}>
        <KanbanBoard title="Home" boardId="home" boardState={homeState} setBoardState={setHomeState} />
      </Grid.Col>
      <Grid.Col span={6}>
        <KanbanBoard title="Work" boardId="work" boardState={workState} setBoardState={setWorkState} />
      </Grid.Col>
    </Grid>
  );
}
