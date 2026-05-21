'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T03
 * Task Name: Reset a moved board back to default
 *
 * Setup Description:
 * A single Kanban board is shown on the page. Above it is a small toolbar with:
 *   - "Reset board" (a MUI Button)
 *   - "Export" (disabled; distractor)
 * The board starts in a non-default state. Clicking "Reset board" restores the
 * default arrangement and shows a brief MUI Snackbar "Board reset".
 *
 * Success: Board matches stored default snapshot "mui_default_state_v1"
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, Button, Snackbar } from '@mui/material';
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

// Default (target) state
const defaultState: KanbanBoardState = {
  todo: [
    { id: 'card_task_a', title: 'TASK-A Setup env' },
    { id: 'card_task_b', title: 'TASK-B Write tests' },
  ],
  in_progress: [
    { id: 'card_task_c', title: 'TASK-C Implement API' },
  ],
  done: [
    { id: 'card_task_d', title: 'TASK-D Design review' },
  ],
};

// Modified initial state
const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_task_c', title: 'TASK-C Implement API' },
  ],
  in_progress: [
    { id: 'card_task_d', title: 'TASK-D Design review' },
    { id: 'card_task_a', title: 'TASK-A Setup env' },
  ],
  done: [
    { id: 'card_task_b', title: 'TASK-B Write tests' },
  ],
};

const columns = [
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
        sx={{ mb: 1, cursor: 'grab', '&:hover': { boxShadow: 2 } }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="body2" fontWeight="medium">{card.title}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 200,
        p: 1.5,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 1,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>{column.title}</Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 100 }}>
          {cards.map(card => <SortableCard key={card.id} card={card} />)}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    if (boardStatesEqual(boardState, defaultState)) {
      successFired.current = true;
      onSuccess();
    }
  }, [boardState, onSuccess]);

  const handleReset = () => {
    setBoardState(JSON.parse(JSON.stringify(defaultState)));
    setSnackOpen(true);
  };

  const findContainer = (id: string): string | undefined => {
    if (columns.some(c => c.id === id)) return id;
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
    const overContainer = findContainer(over.id as string) || (over.id as string);
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
        setBoardState(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeCard = activeId ? Object.values(boardState).flat().find(card => card.id === activeId) : null;

  return (
    <Paper elevation={2} sx={{ p: 3, width: 720 }} data-testid="kanban-board" data-board-id="primary">
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="contained" onClick={handleReset} data-testid="reset-board-btn">
          Reset board
        </Button>
        <Button variant="outlined" disabled>
          Export
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {columns.map(column => (
            <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />
          ))}
        </Box>

        <DragOverlay>
          {activeCard ? (
            <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main' }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" fontWeight="medium">{activeCard.title}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Board reset"
      />
    </Paper>
  );
}
