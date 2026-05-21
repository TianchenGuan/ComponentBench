'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-T09
 * Task Name: Move two specific cards on a busy dashboard
 *
 * Setup Description:
 * The page is a dashboard layout with MUI AppBar, left Drawer, and several widgets.
 * In the main content area is a Kanban board titled "Operations dashboard board".
 *
 * Two target cards must be moved:
 *   - "OPS-19 Rotate logs" (starts in "Backlog") → "In progress"
 *   - "FIN-2 Approve budget" (starts in "Review") → "Done"
 *
 * Success: Both cards in correct columns.
 * Theme: light, Spacing: comfortable, Layout: dashboard, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardContent, Typography, Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
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
    { id: 'card_ops_18', title: 'OPS-18 Setup alerts' },
    { id: 'card_ops_19', title: 'OPS-19 Rotate logs' },
    { id: 'card_fin_1', title: 'FIN-1 Q4 report' },
  ],
  todo: [
    { id: 'card_ops_20', title: 'OPS-20 Update configs' },
  ],
  in_progress: [
    { id: 'card_ops_21', title: 'OPS-21 Deploy fix' },
    { id: 'card_fin_3', title: 'FIN-3 Tax review' },
  ],
  review: [
    { id: 'card_fin_2', title: 'FIN-2 Approve budget' },
    { id: 'card_ops_22', title: 'OPS-22 Check metrics' },
  ],
  done: [
    { id: 'card_ops_23', title: 'OPS-23 Incident resolved' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 0.75, cursor: 'grab', '&:hover': { boxShadow: 2 } }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 0.75, px: 1, '&:last-child': { pb: 0.75 } }}>
          <Typography variant="body2" fontSize={11}>{card.title}</Typography>
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
        minWidth: 110,
        p: 0.75,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 0.5,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>{column.title}</Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 60 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Check success: OPS-19 in "In progress" AND FIN-2 in "Done"
  useEffect(() => {
    if (successFired.current) return;
    const ops19Ok = isCardInColumn(boardState, 'card_ops_19', 'in_progress');
    const fin2Ok = isCardInColumn(boardState, 'card_fin_2', 'done');
    if (ops19Ok && fin2Ok) {
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
    <Box sx={{ display: 'flex', width: 900, height: 500 }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 160, flexShrink: 0, '& .MuiDrawer-paper': { width: 160, position: 'relative' } }}>
        <List dense>
          <ListItem><ListItemText primary="Dashboard" /></ListItem>
          <ListItem><ListItemText primary="Reports" /></ListItem>
          <ListItem><ListItemText primary="Settings" /></ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
          <Toolbar variant="dense">
            <Typography variant="subtitle1">Operations Dashboard</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          {/* Widgets (distractors) */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Paper sx={{ p: 1, flex: 1, bgcolor: 'grey.50' }}>
              <Typography variant="caption">Active alerts: 3</Typography>
            </Paper>
            <Paper sx={{ p: 1, flex: 1, bgcolor: 'grey.50' }}>
              <Typography variant="caption">Uptime: 99.9%</Typography>
            </Paper>
          </Box>

          {/* Kanban board */}
          <Paper elevation={1} sx={{ p: 1.5 }} data-testid="kanban-board" data-board-id="operations_dashboard_board">
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Operations dashboard board</Typography>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                {columns.map(column => <KanbanColumn key={column.id} column={column} cards={boardState[column.id] || []} />)}
              </Box>
              <DragOverlay>
                {activeCard ? (
                  <Card sx={{ cursor: 'grabbing', boxShadow: 4, border: 1, borderColor: 'primary.main' }}>
                    <CardContent sx={{ py: 0.75, px: 1, '&:last-child': { pb: 0.75 } }}>
                      <Typography variant="body2" fontSize={11}>{activeCard.title}</Typography>
                    </CardContent>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
