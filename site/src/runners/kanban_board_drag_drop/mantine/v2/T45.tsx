'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-v2-T45
 * Three boards (Home, Work, Ops). Move OPS-5 to Blocked on Ops only; Save Ops board.
 * Success: card_ops_5 in blocked, Home/Work never dirty and unchanged.
 */

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Box, Title, Group, Paper, Badge } from '@mantine/core';
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

const columns = [
  { id: 'todo', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
  { id: 'blocked', title: 'Blocked' },
];

const initialHome: KanbanBoardState = {
  todo: [
    { id: 'home_t1', title: 'HOME-1 Laundry', category: 'Chores' },
    { id: 'home_t2', title: 'HOME-2 Groceries', category: 'Errands' },
  ],
  in_progress: [{ id: 'home_ip1', title: 'HOME-3 Paint hallway', category: 'DIY' }],
  done: [{ id: 'home_d1', title: 'HOME-4 Declutter closet', category: 'Org' }],
  blocked: [{ id: 'home_b1', title: 'HOME-5 Wait on delivery', category: 'Hold' }],
};

const initialWork: KanbanBoardState = {
  todo: [
    { id: 'work_t1', title: 'WRK-1 Inbox zero', category: 'Email' },
    { id: 'work_t2', title: 'WRK-2 Spec review', category: 'Docs' },
  ],
  in_progress: [{ id: 'work_ip1', title: 'WRK-3 API latency', category: 'Eng' }],
  done: [{ id: 'work_d1', title: 'WRK-4 Release notes', category: 'Comms' }],
  blocked: [{ id: 'work_b1', title: 'WRK-5 Vendor SLA', category: 'Legal' }],
};

const initialOps: KanbanBoardState = {
  todo: [
    { id: 'card_ops_1', title: 'OPS-1 Patch nginx', category: 'Infra' },
    { id: 'card_ops_2', title: 'OPS-2 Rotate certs', category: 'Security' },
  ],
  in_progress: [
    { id: 'card_ops_5', title: 'OPS-5 Rotate keys', category: 'Security' },
    { id: 'card_ops_6', title: 'OPS-6 Disk check', category: 'Infra' },
  ],
  done: [{ id: 'card_ops_3', title: 'OPS-3 Backup verify', category: 'Infra' }],
  blocked: [{ id: 'card_ops_4', title: 'OPS-4 Waiting on vendor', category: 'Vendor' }],
};

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card shadow="xs" p={6} mb={4} style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text size="xs" c="dimmed" mb={2}>
          {card.category}
        </Text>
        <Text fw={500} size="xs">
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 120,
        padding: 6,
        background: isOver ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-default-hover)',
        borderRadius: 4,
        border: `1px solid ${isOver ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-default-border)'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb={6}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 56 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

interface BoardPaneProps {
  title: string;
  boardInstance: string;
  boardDataId: string;
  pending: KanbanBoardState;
  setPending: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
  setCommitted: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
  isDirty: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  saveLabel: string;
  saveTestId: string;
  clutter?: React.ReactNode;
}

function BoardPane({
  title,
  boardInstance,
  boardDataId,
  pending,
  setPending,
  setCommitted,
  isDirty,
  setDirty,
  saveLabel,
  saveTestId,
  clutter,
}: BoardPaneProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const findContainer = useCallback(
    (id: string, state: KanbanBoardState): string | undefined => {
      if (columns.some((c) => c.id === id)) return id;
      for (const [columnId, cards] of Object.entries(state)) {
        if (cards.some((card) => card.id === id)) return columnId;
      }
      return undefined;
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeContainer = findContainer(active.id as string, pending);
    const overContainer = findContainer(over.id as string, pending) || (over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setPending((prev) => {
      const activeCards = [...prev[activeContainer]];
      const overCards = [...prev[overContainer]];
      const activeIndex = activeCards.findIndex((card) => card.id === active.id);
      const activeCard = activeCards[activeIndex];
      activeCards.splice(activeIndex, 1);
      const overIndex = overCards.findIndex((card) => card.id === over.id);
      if (overIndex === -1) overCards.push(activeCard);
      else overCards.splice(overIndex, 0, activeCard);
      return { ...prev, [activeContainer]: activeCards, [overContainer]: overCards };
    });
    setDirty(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string, pending);
    const overContainer = findContainer(over.id as string, pending);
    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) {
      const cards = pending[activeContainer];
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      if (oldIndex !== newIndex) {
        setPending((prev) => ({ ...prev, [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex) }));
        setDirty(true);
      }
    }
  };

  const handleSave = () => {
    setCommitted(JSON.parse(JSON.stringify(pending)));
    setDirty(false);
  };

  const activeCard = activeId ? Object.values(pending).flat().find((card) => card.id === activeId) : null;

  return (
    <Paper p="xs" radius="sm" withBorder style={{ flex: 1, minWidth: 280 }} data-board-instance={boardInstance} data-testid={`board-${boardDataId}`}>
      <Group justify="space-between" mb={6} wrap="nowrap">
        <Title order={6}>{title}</Title>
        <Badge size="xs" variant="light">
          lane
        </Badge>
      </Group>
      {clutter}
      <Box data-testid="kanban-board" data-board-id={boardDataId}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Group gap={6} align="stretch" wrap="nowrap" style={{ overflowX: 'auto' }}>
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} cards={pending[column.id] || []} />
            ))}
          </Group>
          <DragOverlay>
            {activeCard ? (
              <Card shadow="md" p={6} style={{ cursor: 'grabbing' }}>
                <Text size="xs">{activeCard.title}</Text>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
      {isDirty && (
        <Group mt="xs" justify="flex-end">
          <Button size="compact-xs" onClick={handleSave} data-testid={saveTestId}>
            {saveLabel}
          </Button>
        </Group>
      )}
    </Paper>
  );
}

export default function T45({ onSuccess }: TaskComponentProps) {
  const homeInit = useMemo(() => JSON.parse(JSON.stringify(initialHome)) as KanbanBoardState, []);
  const workInit = useMemo(() => JSON.parse(JSON.stringify(initialWork)) as KanbanBoardState, []);
  const opsInit = useMemo(() => JSON.parse(JSON.stringify(initialOps)) as KanbanBoardState, []);

  const [homeCommitted, setHomeCommitted] = useState(() => JSON.parse(JSON.stringify(homeInit)));
  const [homePending, setHomePending] = useState(() => JSON.parse(JSON.stringify(homeInit)));
  const [homeDirty, setHomeDirty] = useState(false);

  const [workCommitted, setWorkCommitted] = useState(() => JSON.parse(JSON.stringify(workInit)));
  const [workPending, setWorkPending] = useState(() => JSON.parse(JSON.stringify(workInit)));
  const [workDirty, setWorkDirty] = useState(false);

  const [opsCommitted, setOpsCommitted] = useState(() => JSON.parse(JSON.stringify(opsInit)));
  const [opsPending, setOpsPending] = useState(() => JSON.parse(JSON.stringify(opsInit)));
  const [opsDirty, setOpsDirty] = useState(false);

  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const homeOk = !homeDirty && serializeBoardState(homeCommitted) === serializeBoardState(homeInit);
    const workOk = !workDirty && serializeBoardState(workCommitted) === serializeBoardState(workInit);
    const opsOk =
      !opsDirty &&
      isCardInColumn(opsCommitted, 'card_ops_5', 'blocked');
    if (homeOk && workOk && opsOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [homeDirty, workDirty, opsDirty, homeCommitted, workCommitted, opsCommitted, homeInit, workInit, onSuccess]);

  return (
    <Box p="xs" style={{ maxWidth: 1100 }}>
      <Text size="xs" c="dimmed" mb="xs">
        Dashboard · three boards · compact clutter
      </Text>
      <Group gap="xs" mb="md" wrap="wrap">
        <Badge>Alerts 12</Badge>
        <Text size="xs">Queue depth · synthetic</Text>
        <Badge color="gray">v2</Badge>
      </Group>
      <Group align="stretch" gap="md" wrap="wrap" justify="flex-start">
        <BoardPane
          title="Home"
          boardInstance="Home"
          boardDataId="home_board"
          pending={homePending}
          setPending={setHomePending}
          setCommitted={setHomeCommitted}
          isDirty={homeDirty}
          setDirty={setHomeDirty}
          saveLabel="Save Home board"
          saveTestId="save-home-board"
          clutter={
            <Text size="xs" c="dimmed" mb={6}>
              Personal · unrelated tasks
            </Text>
          }
        />
        <BoardPane
          title="Work"
          boardInstance="Work"
          boardDataId="work_board"
          pending={workPending}
          setPending={setWorkPending}
          setCommitted={setWorkCommitted}
          isDirty={workDirty}
          setDirty={setWorkDirty}
          saveLabel="Save Work board"
          saveTestId="save-work-board"
          clutter={
            <Text size="xs" c="dimmed" mb={6}>
              Sprint hygiene · ignore for this task
            </Text>
          }
        />
        <BoardPane
          title="Ops"
          boardInstance="Ops"
          boardDataId="ops_board"
          pending={opsPending}
          setPending={setOpsPending}
          setCommitted={setOpsCommitted}
          isDirty={opsDirty}
          setDirty={setOpsDirty}
          saveLabel="Save Ops board"
          saveTestId="save-ops-board"
          clutter={
            <Text size="xs" c="orange" mb={6} fw={500}>
              Target: move OPS-5 Rotate keys → Blocked, then save here only.
            </Text>
          }
        />
      </Group>
    </Box>
  );
}
