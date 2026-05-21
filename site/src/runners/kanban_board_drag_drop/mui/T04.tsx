'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T04
 * Task Name: Choose the correct board instance and move a card
 *
 * Setup Description:
 * The page shows two Kanban boards stacked vertically:
 *   - "Personal" (top)
 *   - "Team" (bottom; target instance)
 * Both boards share the same column labels ("To do", "In progress", "Done").
 *
 * Initial state: on the Team board, "TEAM-6 Prepare demo" is in "In progress".
 *
 * Success: On Team board, TEAM-6 is in "Done" column.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, Stack } from '@mui/material';
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

const personalInitialState: KanbanBoardState = {
  todo: [{ id: 'card_per_1', title: 'PER-1 Groceries' }],
  in_progress: [{ id: 'card_per_2', title: 'PER-2 Laundry' }],
  done: [{ id: 'card_per_3', title: 'PER-3 Call mom' }],
};

const teamInitialState: KanbanBoardState = {
  todo: [{ id: 'card_team_5', title: 'TEAM-5 Review PR' }],
  in_progress: [
    { id: 'card_team_6', title: 'TEAM-6 Prepare demo' },
    { id: 'card_team_7', title: 'TEAM-7 Update docs' },
  ],
  done: [{ id: 'card_team_8', title: 'TEAM-8 Sprint planning' }],
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
      <Card sx={{ mb: 1, cursor: 'grab', '&:hover': { boxShadow: 2 } }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" fontSize={13}>{card.title}</Typography>
        </CardContent>
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
      sx={{
        flex: 1,
        minWidth: 140,
        p: 1,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 1,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`${boardId}-column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>{column.title}</Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 60 }}>
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
    <Paper elevation={1} sx={{ p: 2 }} data-testid={`kanban-board-${boardId}`} data-board-id={boardId} data-board-label={title}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>{title}</Typography>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} boardId={boardId} />)}
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main' }}>
              <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Typography variant="body2" fontSize={13}>{activeCard.title}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [personalState, setPersonalState] = useState<KanbanBoardState>(personalInitialState);
  const [teamState, setTeamState] = useState<KanbanBoardState>(teamInitialState);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(teamState, 'card_team_6', 'done')) {
      successFired.current = true;
      onSuccess();
    }
  }, [teamState, onSuccess]);

  return (
    <Stack spacing={2} sx={{ width: 600 }}>
      <KanbanBoard title="Personal" boardId="personal" boardState={personalState} setBoardState={setPersonalState} />
      <KanbanBoard title="Team" boardId="team" boardState={teamState} setBoardState={setTeamState} />
    </Stack>
  );
}
