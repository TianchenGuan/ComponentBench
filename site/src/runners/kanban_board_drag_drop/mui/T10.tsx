'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T10
 * Task Name: Match a visual reference for highlighted cards (top-left placement)
 *
 * Setup Description:
 * The board is anchored near the TOP-LEFT of the viewport inside a MUI Card titled
 * "Release checklist". A static visual reference strip appears above the board.
 *
 * Three highlighted cards must be arranged:
 *   - "REL-7 Cut release branch" → "In progress"
 *   - "REL-8 Tag v1.2.0" → "Done"
 *   - "REL-9 Announce release" → first card in "Done"
 *
 * Success: All three cards in correct positions.
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: TOP_LEFT
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, Divider } from '@mui/material';
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
import { isCardInColumn, isCardAtIndex } from '../types';

const HIGHLIGHTED_CARDS = ['card_rel_7', 'card_rel_8', 'card_rel_9'];

const initialState: KanbanBoardState = {
  backlog: [{ id: 'card_rel_5', title: 'REL-5 Draft notes' }],
  todo: [
    { id: 'card_rel_6', title: 'REL-6 Update version' },
    { id: 'card_rel_7', title: 'REL-7 Cut release branch' }, // Should go to in_progress
  ],
  in_progress: [
    { id: 'card_rel_8', title: 'REL-8 Tag v1.2.0' }, // Should go to done
  ],
  done: [
    { id: 'card_rel_10', title: 'REL-10 Build artifacts' },
    { id: 'card_rel_9', title: 'REL-9 Announce release' }, // Should be first in done
    { id: 'card_rel_11', title: 'REL-11 Deploy docs' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card, highlighted }: { card: KanbanCard; highlighted: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        sx={{
          mb: 1,
          cursor: 'grab',
          border: highlighted ? 2 : 1,
          borderColor: highlighted ? 'warning.main' : 'grey.300',
          bgcolor: highlighted ? 'warning.50' : undefined,
          '&:hover': { boxShadow: 2 },
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" fontSize={13}>{card.title}</Typography>
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
        minWidth: 160,
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
          {cards.map(card => (
            <SortableCard key={card.id} card={card} highlighted={HIGHLIGHTED_CARDS.includes(card.id)} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Check success:
  // - REL-7 in "In progress"
  // - REL-8 in "Done"
  // - REL-9 is first in "Done"
  useEffect(() => {
    if (successFired.current) return;
    const rel7Ok = isCardInColumn(boardState, 'card_rel_7', 'in_progress');
    const rel8Ok = isCardInColumn(boardState, 'card_rel_8', 'done');
    const rel9First = isCardAtIndex(boardState, 'done', 'card_rel_9', 0);
    if (rel7Ok && rel8Ok && rel9First) {
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
        setBoardState(prev => ({ ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) }));
      }
    }
  };

  const activeCard = activeId ? Object.values(boardState).flat().find(card => card.id === activeId) : null;

  return (
    <Paper elevation={2} sx={{ p: 2, width: 780 }} data-testid="kanban-board" data-board-id="release_checklist">
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Release checklist</Typography>

      {/* Reference strip */}
      <Box
        sx={{ bgcolor: 'info.50', border: 1, borderColor: 'info.main', borderRadius: 1, p: 1, mb: 2 }}
        data-testid="reference-strip"
        data-ref-id="ref_release_strip_v1"
      >
        <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 0.5 }}>
          Reference — Match highlighted cards:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, fontSize: 11 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">In progress:</Typography>
            <Box sx={{ p: 0.5, bgcolor: 'warning.50', border: 1, borderColor: 'warning.main', borderRadius: 0.5, mt: 0.5 }}>
              REL-7 Cut release branch
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Done:</Typography>
            <Box sx={{ p: 0.5, bgcolor: 'warning.50', border: 1, borderColor: 'warning.main', borderRadius: 0.5, mt: 0.5 }}>
              REL-8 Tag v1.2.0
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Done (first):</Typography>
            <Box sx={{ p: 0.5, bgcolor: 'warning.50', border: 1, borderColor: 'warning.main', borderRadius: 0.5, mt: 0.5 }}>
              REL-9 Announce release
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
        </Box>
        <DragOverlay>
          {activeCard ? (
            <Card
              sx={{
                cursor: 'grabbing',
                boxShadow: 4,
                border: HIGHLIGHTED_CARDS.includes(activeCard.id) ? 2 : 1,
                borderColor: HIGHLIGHTED_CARDS.includes(activeCard.id) ? 'warning.main' : 'primary.main',
                bgcolor: HIGHLIGHTED_CARDS.includes(activeCard.id) ? 'warning.50' : undefined,
              }}
            >
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
