'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T07
 * Task Name: Move a card in a crowded form section
 *
 * Setup Description:
 * The page is a form_section layout titled "Create sprint". The top contains MUI form
 * fields (Sprint name TextField, Owner Select, Date field) as distractors.
 * Below is a section header "Work items" with the Kanban board embedded.
 *
 * Initial state: "DOC-11 Update API docs" is in "To do" column.
 *
 * Success: DOC-11 is in "Review" column.
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
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
  backlog: [{ id: 'card_doc_10', title: 'DOC-10 Update README' }],
  todo: [
    { id: 'card_doc_11', title: 'DOC-11 Update API docs' },
    { id: 'card_doc_12', title: 'DOC-12 Write guide' },
  ],
  review: [{ id: 'card_doc_13', title: 'DOC-13 Review changelog' }],
  done: [{ id: 'card_doc_14', title: 'DOC-14 Fix typos' }],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 1, cursor: 'grab', '&:hover': { boxShadow: 2 } }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" fontSize={12}>{card.title}</Typography>
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
        minWidth: 140,
        p: 1,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 1,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>{column.title}</Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 80 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_doc_11', 'review')) {
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
    <Paper elevation={2} sx={{ p: 3, width: 700 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Create sprint</Typography>

      {/* Form fields (distractors) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField label="Sprint name" size="small" defaultValue="Sprint 12" sx={{ flex: 1 }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Owner</InputLabel>
          <Select defaultValue="alice" label="Owner">
            <MenuItem value="alice">Alice</MenuItem>
            <MenuItem value="bob">Bob</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Start date" size="small" type="date" defaultValue="2024-01-15" InputLabelProps={{ shrink: true }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Work items section */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>Work items</Typography>

      <Box data-testid="kanban-board" data-board-id="work_items">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
          </Box>
          <DragOverlay>
            {activeCard ? (
              <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main' }}>
                <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" fontSize={12}>{activeCard.title}</Typography>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </Paper>
  );
}
