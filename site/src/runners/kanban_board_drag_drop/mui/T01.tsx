'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T01
 * Task Name: Move a task card to In progress
 *
 * Setup Description:
 * The page shows a single centered MUI Paper titled "Release Board".
 * Columns: "Backlog", "In progress", "Done".
 * Each card is a MUI Card with title and small Chip for priority.
 * Initial state: "REL-4 Update changelog" is in "Backlog".
 *
 * Success: Move "REL-4 Update changelog" to "In progress".
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Chip, Box } from '@mui/material';
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

const initialState: KanbanBoardState = {
  backlog: [
    { id: 'card_rel_3', title: 'REL-3 Review PRs', priority: 'medium' },
    { id: 'card_rel_4', title: 'REL-4 Update changelog', priority: 'high' },
  ],
  in_progress: [
    { id: 'card_rel_5', title: 'REL-5 Run tests', priority: 'high' },
  ],
  done: [
    { id: 'card_rel_1', title: 'REL-1 Freeze code', priority: 'low' },
    { id: 'card_rel_2', title: 'REL-2 Tag version', priority: 'medium' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

function getPriorityColor(priority?: string): 'default' | 'error' | 'warning' | 'success' {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
}

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
        sx={{
          mb: 1,
          cursor: 'grab',
          '&:hover': { boxShadow: 2 },
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="body2" fontWeight={600}>{card.title}</Typography>
          {card.priority && (
            <Chip
              label={card.priority}
              size="small"
              color={getPriorityColor(card.priority)}
              sx={{ mt: 0.5, height: 20, fontSize: 10 }}
            />
          )}
        </CardContent>
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
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 200,
        p: 1.5,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 2,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {column.title}
      </Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 100 }}>
          {cards.map(card => (
            <SortableCard key={card.id} card={card} />
          ))}
        </Box>
      </SortableContext>
    </Paper>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: REL-4 in "In progress"
  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_rel_4', 'in_progress')) {
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
    <Paper
      elevation={2}
      sx={{ p: 3, maxWidth: 700 }}
      data-testid="kanban-board"
      data-board-id="release_board"
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Release Board</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={boardState[column.id] || []}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeCard ? (
            <Card sx={{ cursor: 'grabbing', boxShadow: 4 }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" fontWeight={600}>{activeCard.title}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
