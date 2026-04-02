'use client';

/**
 * Task ID: kanban_board_drag_drop-mui-v2-T41
 * MUI: Team board only with overlapping card title and save
 *
 * Setup: settings_panel. Stacked boards "Personal" and "Team". Both show "Prepare demo"
 * (distinct card ids). Team card starts in In progress. Board-local saves.
 *
 * Success (require_confirm: Save Team board): Team committed has card_team_prepare_demo
 * in done; Personal committed still has card_personal_prepare_demo in todo.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material';
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
import type { TaskComponentProps, KanbanCard, KanbanBoardState } from '../../types';
import { isCardInColumn, serializeBoardState } from '../../types';

type BoardName = 'personal' | 'team';

interface DualBoardState {
  personal: KanbanBoardState;
  team: KanbanBoardState;
}

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

function cloneBoard(s: KanbanBoardState): KanbanBoardState {
  return JSON.parse(JSON.stringify(s)) as KanbanBoardState;
}

const initialDual: DualBoardState = {
  personal: {
    todo: [
      { id: 'card_personal_prepare_demo', title: 'Prepare demo' },
      { id: 'card_p1', title: 'Personal: Inbox zero' },
    ],
    in_progress: [{ id: 'card_p2', title: 'Personal: Book dentist' }],
    review: [],
    done: [{ id: 'card_p3', title: 'Personal: Renew license' }],
  },
  team: {
    todo: [{ id: 'card_t1', title: 'Team: Triage bugs' }],
    in_progress: [
      { id: 'card_team_prepare_demo', title: 'Prepare demo' },
      { id: 'card_t2', title: 'Team: Standup notes' },
    ],
    review: [{ id: 'card_t3', title: 'Team: Spec review' }],
    done: [{ id: 'card_t4', title: 'Team: Ship hotfix' }],
  },
};

function cloneDual(s: DualBoardState): DualBoardState {
  return JSON.parse(JSON.stringify(s)) as DualBoardState;
}

function droppableId(board: BoardName, columnId: string) {
  return `${board}__${columnId}`;
}

function parseDroppableId(id: string): { board: BoardName; columnId: string } | undefined {
  const sep = id.indexOf('__');
  if (sep === -1) return undefined;
  const board = id.slice(0, sep) as BoardName;
  const columnId = id.slice(sep + 2);
  if (board !== 'personal' && board !== 'team') return undefined;
  return { board, columnId };
}

function findCardLocation(
  dual: DualBoardState,
  cardId: string
): { board: BoardName; columnId: string } | undefined {
  for (const board of ['personal', 'team'] as const) {
    for (const [columnId, cards] of Object.entries(dual[board])) {
      if (cards.some(c => c.id === cardId)) return { board, columnId };
    }
  }
  return undefined;
}

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 0.4, cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <CardContent sx={{ py: 0.45, px: 0.75, '&:last-child': { pb: 0.45 } }}>
          <Typography variant="caption" fontSize={10}>{card.title}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({
  board,
  column,
  cards,
}: {
  board: BoardName;
  column: { id: string; title: string };
  cards: KanbanCard[];
}) {
  const id = droppableId(board, column.id);
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 100,
        p: 0.5,
        bgcolor: isOver ? 'action.hover' : 'grey.100',
        borderRadius: 0.5,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'grey.300',
      }}
      data-testid={`column-${board}-${column.id}`}
      data-column-id={column.id}
    >
      <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.35, display: 'block', fontSize: 9 }}>
        {column.title}
      </Typography>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ minHeight: 52 }}>{cards.map(card => <SortableCard key={card.id} card={card} />)}</Box>
      </SortableContext>
    </Box>
  );
}

function BoardBlock({
  title,
  board,
  draft,
  instanceLabel,
}: {
  title: string;
  board: BoardName;
  draft: KanbanBoardState;
  instanceLabel: string;
}) {
  const boardId = board === 'team' ? 'team' : 'personal';
  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.25, mb: 1.5 }}
      data-testid={`kanban-board-${boardId}`}
      data-board-id={boardId}
      data-instance-label={instanceLabel}
    >
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {columns.map(column => (
          <KanbanColumn key={column.id} board={board} column={column} cards={draft[column.id] || []} />
        ))}
      </Box>
    </Paper>
  );
}

export default function T41({ onSuccess }: TaskComponentProps) {
  const [draft, setDraft] = useState<DualBoardState>(() => cloneDual(initialDual));
  const [committed, setCommitted] = useState<DualBoardState>(() => cloneDual(initialDual));
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const personalDirty = serializeBoardState(draft.personal) !== serializeBoardState(committed.personal);
  const teamDirty = serializeBoardState(draft.team) !== serializeBoardState(committed.team);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    const ok =
      isCardInColumn(committed.team, 'card_team_prepare_demo', 'done') &&
      isCardInColumn(committed.personal, 'card_personal_prepare_demo', 'todo');
    if (ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    setDraft(prev => {
      const activeLoc = findCardLocation(prev, active.id as string);
      let overBoard: BoardName | undefined;
      let overColumnId: string | undefined;
      const parsed = parseDroppableId(over.id as string);
      if (parsed) {
        overBoard = parsed.board;
        overColumnId = parsed.columnId;
      } else {
        const overLoc = findCardLocation(prev, over.id as string);
        if (overLoc) {
          overBoard = overLoc.board;
          overColumnId = overLoc.columnId;
        }
      }
      if (!activeLoc || !overBoard || !overColumnId) return prev;
      if (activeLoc.board === overBoard && activeLoc.columnId === overColumnId) return prev;

      const next = cloneDual(prev);
      const fromBoard = next[activeLoc.board];
      const toBoard = next[overBoard];
      const fromCards = [...(fromBoard[activeLoc.columnId] || [])];
      const toCards = [...(toBoard[overColumnId] || [])];
      const activeIndex = fromCards.findIndex(c => c.id === active.id);
      if (activeIndex === -1) return prev;
      const [moved] = fromCards.splice(activeIndex, 1);
      const overIndex = toCards.findIndex(c => c.id === over.id);
      if (overIndex === -1) toCards.push(moved);
      else toCards.splice(overIndex, 0, moved);

      next[activeLoc.board] = { ...fromBoard, [activeLoc.columnId]: fromCards };
      next[overBoard] = { ...toBoard, [overColumnId]: toCards };

      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    setDraft(prev => {
      const activeLoc = findCardLocation(prev, active.id as string);
      const overLoc = findCardLocation(prev, over.id as string);
      if (!activeLoc || !overLoc) return prev;
      if (activeLoc.board !== overLoc.board || activeLoc.columnId !== overLoc.columnId) return prev;

      const boardKey = activeLoc.board;
      const col = activeLoc.columnId;
      const cards = prev[boardKey][col] || [];
      const oldIndex = cards.findIndex(c => c.id === active.id);
      const newIndex = cards.findIndex(c => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

      const next = cloneDual(prev);
      next[boardKey] = {
        ...next[boardKey],
        [col]: arrayMove(next[boardKey][col] || [], oldIndex, newIndex),
      };
      return next;
    });
  };

  const savePersonal = () => {
    const personal = cloneBoard(draft.personal);
    setCommitted(c => ({ ...c, personal }));
    setDraft(d => ({ ...d, personal }));
  };

  const saveTeam = () => {
    const team = cloneBoard(draft.team);
    setCommitted(c => ({ ...c, team }));
    setDraft(d => ({ ...d, team }));
  };

  const findActiveCard = (): KanbanCard | null => {
    if (!activeId) return null;
    for (const b of ['personal', 'team'] as const) {
      for (const col of Object.keys(draft[b])) {
        const found = draft[b][col]?.find(c => c.id === activeId);
        if (found) return found;
      }
    }
    return null;
  };

  const overlayCard = findActiveCard();

  return (
    <Stack spacing={0} sx={{ width: '100%', maxWidth: 720 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        Workspace settings
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <BoardBlock title="Personal" board="personal" draft={draft.personal} instanceLabel="Personal" />
        <BoardBlock title="Team" board="team" draft={draft.team} instanceLabel="Team" />

        <DragOverlay>
          {overlayCard ? (
            <Card sx={{ cursor: 'grabbing', boxShadow: 4 }}>
              <CardContent sx={{ py: 0.45, px: 0.75, '&:last-child': { pb: 0.45 } }}>
                <Typography variant="caption" fontSize={10}>{overlayCard.title}</Typography>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>
        {personalDirty ? (
          <Button size="small" variant="outlined" onClick={savePersonal} data-testid="save-personal-board-btn">
            Save Personal board
          </Button>
        ) : null}
        {teamDirty ? (
          <Button size="small" variant="contained" onClick={saveTeam} data-testid="save-team-board-btn">
            Save Team board
          </Button>
        ) : null}
      </Box>
    </Stack>
  );
}
