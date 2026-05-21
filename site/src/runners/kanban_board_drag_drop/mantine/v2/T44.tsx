'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-v2-T44
 * Sprint queue: scroll To do lane (ScrollArea), move BUG-9 to In progress, Save board.
 * Success: card_bug_9 in in_progress, committed, require_confirm Save board.
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Box, Title, Group, ScrollArea } from '@mantine/core';
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
import { isCardInColumn } from '../../types';

function makeTodoCards(): KanbanCard[] {
  const out: KanbanCard[] = [];
  for (let i = 1; i <= 8; i += 1) {
    out.push({ id: `card_bug_${i}`, title: `BUG-${i} Placeholder ticket`, category: 'Backlog' });
  }
  out.push({ id: 'card_bug_9', title: 'BUG-9 Fix notifications', category: 'Mobile' });
  return out;
}

const baseInitial: KanbanBoardState = {
  todo: makeTodoCards(),
  in_progress: [
    { id: 'card_bug_ip_1', title: 'BUG-10 Polish empty state', category: 'UI' },
  ],
  done: [{ id: 'card_bug_done_1', title: 'BUG-4 Cache headers', category: 'Perf' }],
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
      <Card shadow="xs" p="xs" mb={6} style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text size="xs" c="dimmed" mb={4}>
          {card.category}
        </Text>
        <Text fw={500} size="xs">
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function KanbanColumn({
  column,
  cards,
  scrollTodo,
}: {
  column: { id: string; title: string };
  cards: KanbanCard[];
  scrollTodo: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const inner = (
    <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
      <Box style={{ minHeight: scrollTodo ? 0 : 72 }}>
        {cards.map((card) => (
          <SortableCard key={card.id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 160,
        padding: 8,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 6,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
        display: 'flex',
        flexDirection: 'column',
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb="sm">
        {column.title}
      </Text>
      {scrollTodo ? (
        <ScrollArea
          h={220}
          type="always"
          offsetScrollbars
          data-testid="todo-lane-scroll"
          data-scroll-region="todo-lane"
        >
          {inner}
        </ScrollArea>
      ) : (
        inner
      )}
    </Box>
  );
}

export default function T44({ onSuccess }: TaskComponentProps) {
  const initial = useMemo(() => JSON.parse(JSON.stringify(baseInitial)) as KanbanBoardState, []);
  const [committed, setCommitted] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initial)));
  const [pending, setPending] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initial)));
  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (!isDirty && isCardInColumn(committed, 'card_bug_9', 'in_progress')) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, isDirty, onSuccess]);

  const findContainer = (id: string, state: KanbanBoardState): string | undefined => {
    if (columns.some((c) => c.id === id)) return id;
    for (const [columnId, cards] of Object.entries(state)) {
      if (cards.some((card) => card.id === id)) return columnId;
    }
    return undefined;
  };

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
    setIsDirty(true);
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
        setIsDirty(true);
      }
    }
  };

  const handleSave = () => {
    setCommitted(JSON.parse(JSON.stringify(pending)));
    setIsDirty(false);
  };

  const activeCard = activeId ? Object.values(pending).flat().find((card) => card.id === activeId) : null;

  return (
    <Box style={{ minHeight: '140vh', padding: 8 }}>
      <Box style={{ height: 48, marginBottom: 8, background: '#eee', borderRadius: 4 }} />
      <Text size="xs" mb="xs" c="dimmed">
        Page also scrolls — use the To do lane scrollbar to reveal BUG-9.
      </Text>

      <Card shadow="sm" p="md" maw={700} mx="auto" data-testid="kanban-board" data-board-id="sprint_queue" data-board-instance="Sprint queue">
        <Title order={5} mb="sm">
          Sprint queue
        </Title>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Group gap="sm" align="stretch" wrap="nowrap">
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} cards={pending[column.id] || []} scrollTodo={column.id === 'todo'} />
            ))}
          </Group>
          <DragOverlay>
            {activeCard ? (
              <Card shadow="md" p="xs" style={{ cursor: 'grabbing', border: '1px solid #228be6' }}>
                <Text fw={500} size="xs">
                  {activeCard.title}
                </Text>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>

        {isDirty && (
          <Group mt="md" pt="md" style={{ borderTop: '1px solid #dee2e6' }} justify="flex-end">
            <Button onClick={handleSave} data-testid="save-board-btn">
              Save board
            </Button>
          </Group>
        )}
      </Card>

      <Box style={{ height: '55vh', marginTop: 24, background: '#f1f3f5', borderRadius: 4 }} />
    </Box>
  );
}
