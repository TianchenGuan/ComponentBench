'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-v2-T47
 * Security board drawer: horizontal scroll to Done; SEC-9 directly above AUD-2 in Done; Save board; drawer closes.
 * Success: committed adjacency, overlay closed, require_confirm Save board.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Box, Title, Group, Drawer, ScrollArea } from '@mantine/core';
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
import { isCardDirectlyAbove } from '../../types';

const initialState: KanbanBoardState = {
  backlog: [
    { id: 'card_sec_b1', title: 'SEC-B1 Policy draft', category: 'GRC' },
    { id: 'card_sec_b2', title: 'SEC-B2 Vendor review', category: 'Third-party' },
  ],
  todo: [
    { id: 'card_sec_t1', title: 'SEC-1 Patch OpenSSL', category: 'Infra' },
    { id: 'card_sec_t2', title: 'SEC-2 IAM audit', category: 'Access' },
  ],
  review: [
    { id: 'card_sec_9', title: 'SEC-9 Rotate API keys', category: 'Keys' },
    { id: 'card_sec_r2', title: 'SEC-8 TLS inventory', category: 'Certs' },
  ],
  done: [
    { id: 'card_aud_1', title: 'AUD-1 Sample access', category: 'Audit' },
    { id: 'card_aud_2', title: 'AUD-2 Review logs', category: 'Audit' },
  ],
};

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const hc = {
  bg: '#000000',
  fg: '#ffffff',
  border: '#ffff00',
  colBg: '#0a0a0a',
  hover: '#1a1a00',
};

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        shadow="xs"
        p="xs"
        mb={6}
        style={{
          cursor: 'grab',
          background: hc.colBg,
          border: `1px solid ${hc.border}`,
        }}
        data-testid={`card-${card.id}`}
        data-card-id={card.id}
      >
        <Text size="xs" c="yellow" mb={4}>
          {card.category}
        </Text>
        <Text fw={500} size="sm" c={hc.fg}>
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
        flex: '0 0 168px',
        padding: 8,
        background: isOver ? hc.hover : hc.colBg,
        borderRadius: 6,
        border: `2px solid ${isOver ? hc.border : '#444'}`,
        minHeight: 200,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={700} size="xs" mb="sm" c={hc.fg}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 72 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

export default function T47({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [committed, setCommitted] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initialState)));
  const [pending, setPending] = useState<KanbanBoardState>(() => JSON.parse(JSON.stringify(initialState)));
  const [isDirty, setIsDirty] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (successFired.current) return;
    if (
      !drawerOpen &&
      !isDirty &&
      isCardDirectlyAbove(committed, 'done', 'card_sec_9', 'card_aud_2')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [drawerOpen, isDirty, committed, onSuccess]);

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
    setDrawerOpen(false);
  };

  const handleDrawerClose = () => {
    setPending(JSON.parse(JSON.stringify(committed)));
    setIsDirty(false);
    setDrawerOpen(false);
  };

  const activeCard = activeId ? Object.values(pending).flat().find((card) => card.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box p="xs">
        <Button size="compact-sm" onClick={() => setDrawerOpen(true)}>
          Open Security board
        </Button>

        <Drawer
          opened={drawerOpen}
          onClose={handleDrawerClose}
          title="Security board"
          position="right"
          size={420}
          padding="md"
          styles={{
            content: { background: hc.bg },
            header: { background: hc.bg, borderBottom: `1px solid ${hc.border}` },
            title: { color: hc.fg },
            body: { background: hc.bg },
          }}
        >
          <Box data-testid="kanban-board" data-board-id="security_drawer" data-board-instance="Security board (drawer)">
            <Title order={5} mb="xs" c={hc.fg}>
              Security board
            </Title>
            <Text size="xs" c="yellow" mb="sm">
              Scroll horizontally to reach Done · high contrast
            </Text>

            <ScrollArea
              type="always"
              scrollbars="x"
              offsetScrollbars
              w="100%"
              mb="md"
              data-testid="board-horizontal-scroll"
              data-scroll-region="board-horizontal"
            >
              <Group gap="sm" align="stretch" wrap="nowrap" style={{ minWidth: 720, paddingBottom: 8 }}>
                {columns.map((column) => (
                  <KanbanColumn key={column.id} column={column} cards={pending[column.id] || []} />
                ))}
              </Group>
            </ScrollArea>

            {isDirty && (
              <Group mt="md" pt="md" style={{ borderTop: `1px solid ${hc.border}` }} justify="flex-end">
                <Button variant="outline" color="yellow" onClick={() => { setPending(JSON.parse(JSON.stringify(committed))); setIsDirty(false); }}>
                  Cancel
                </Button>
                <Button color="yellow" c="#000" onClick={handleSave} data-testid="save-board-btn">
                  Save board
                </Button>
              </Group>
            )}
          </Box>
        </Drawer>
      </Box>

      <DragOverlay>
        {activeCard ? (
          <Card
            shadow="md"
            p="xs"
            style={{ cursor: 'grabbing', background: hc.colBg, border: `1px solid ${hc.border}` }}
          >
            <Text size="xs" c="yellow" mb={4}>
              {activeCard.category}
            </Text>
            <Text fw={500} size="sm" c={hc.fg}>
              {activeCard.title}
            </Text>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
