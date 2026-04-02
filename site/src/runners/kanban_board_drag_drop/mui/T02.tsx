'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T02
 * Task Name: Reorder cards within Done
 *
 * Setup Description:
 * The page shows one Kanban board. Columns are "To do", "In progress", and "Done".
 * The Done column contains three cards in this initial order:
 *   1) "OPS-8 Enable backups"
 *   2) "DOC-2 Publish API docs" (target)
 *   3) "UX-1 Fix contrast"
 *
 * Success: In column "Done", DOC-2 is the first (topmost) card.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box } from '@mui/material';
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
import { isCardAtIndex } from '../types';

const initialState: KanbanBoardState = {
  todo: [
    { id: 'card_dev_1', title: 'DEV-1 New feature' },
  ],
  in_progress: [
    { id: 'card_dev_2', title: 'DEV-2 Fix bug' },
  ],
  done: [
    { id: 'card_ops_8', title: 'OPS-8 Enable backups' },
    { id: 'card_doc_2', title: 'DOC-2 Publish API docs' },
    { id: 'card_ux_1', title: 'UX-1 Fix contrast' },
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
        sx={{
          mb: 1,
          cursor: 'grab',
          '&:hover': { boxShadow: 2 },
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="body2" fontWeight="medium">
            {card.title}
          </Typography>
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
        transition: 'all 0.2s',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
        {column.title}
      </Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 100 }}>
          {cards.map(card => (
            <SortableCard key={card.id} card={card} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check success: DOC-2 is first in "Done"
  useEffect(() => {
    if (successFired.current) return;
    if (isCardAtIndex(boardState, 'done', 'card_doc_2', 0)) {
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
      sx={{ p: 3, width: 720 }}
      data-testid="kanban-board"
      data-board-id="primary"
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Task Board
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 1.5 }}>
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
            <Card
              sx={{
                cursor: 'grabbing',
                boxShadow: 4,
                border: 1,
                borderColor: 'primary.main',
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" fontWeight="medium">
                  {activeCard.title}
                </Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
