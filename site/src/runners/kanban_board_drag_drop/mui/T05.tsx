'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T05
 * Task Name: Open a drawer and move a card inside
 *
 * Setup Description:
 * The main page shows a settings-like panel with a left sidebar and a primary button
 * labeled "Open board drawer". Clicking it opens a right-side MUI Drawer titled
 * "Board drawer". The Kanban board is inside this drawer.
 *
 * Initial state: "BUG-51 Fix crash on start" is in "To do".
 *
 * Success: Within the Drawer board, BUG-51 is in "In progress".
 * Theme: light, Spacing: comfortable, Layout: drawer_flow, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, Button, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
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
  todo: [
    { id: 'card_bug_50', title: 'BUG-50 Fix login' },
    { id: 'card_bug_51', title: 'BUG-51 Fix crash on start' },
  ],
  in_progress: [{ id: 'card_bug_52', title: 'BUG-52 Fix memory leak' }],
  done: [{ id: 'card_bug_53', title: 'BUG-53 Fix UI glitch' }],
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

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 130,
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

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (isCardInColumn(boardState, 'card_bug_51', 'in_progress')) {
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
    <Box sx={{ display: 'flex', width: 700 }}>
      {/* Sidebar */}
      <Paper sx={{ width: 180, p: 2, mr: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Settings</Typography>
        <List dense>
          <ListItem><ListItemText primary="General" /></ListItem>
          <ListItem><ListItemText primary="Notifications" /></ListItem>
          <ListItem><ListItemText primary="Privacy" /></ListItem>
        </List>
      </Paper>

      {/* Main */}
      <Paper sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Dashboard</Typography>
        <Button variant="contained" onClick={() => setDrawerOpen(true)} data-testid="open-board-drawer-btn">
          Open board drawer
        </Button>
      </Paper>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} data-testid="board-drawer">
        <Box sx={{ width: 500, p: 2 }} data-testid="kanban-board" data-board-id="board_drawer">
          <Typography variant="h6" sx={{ mb: 2 }}>Board drawer</Typography>
          <Divider sx={{ mb: 2 }} />

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
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
        </Box>
      </Drawer>
    </Box>
  );
}
