'use client';

/**
 * Task ID: kanban_board_drag_drop-mantine-v2-T46
 * Release table: Mobile app row mini-board — APP-3 bottom of Done; Save (save-mobile-row).
 * Web app row must stay pristine (no dirty / no committed change).
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Box, Group, Table } from '@mantine/core';
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
import { serializeBoardState } from '../../types';

const miniColumns = [
  { id: 'todo', title: 'To do' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const initialMobile: KanbanBoardState = {
  todo: [{ id: 'card_app_1', title: 'APP-1 Onboarding tips', category: 'UX' }],
  review: [
    { id: 'card_app_2', title: 'APP-2 Dark mode QA', category: 'QA' },
    { id: 'card_app_3', title: 'APP-3 Finish paywall', category: 'Revenue' },
  ],
  done: [
    { id: 'card_app_0', title: 'APP-0 Crash fix', category: 'Stability' },
    { id: 'card_app_4', title: 'APP-4 Analytics hook', category: 'Data' },
  ],
};

const initialWeb: KanbanBoardState = {
  todo: [{ id: 'card_web_1', title: 'WEB-1 SSR cache', category: 'Perf' }],
  review: [{ id: 'card_web_2', title: 'WEB-2 A11y audit', category: 'A11y' }],
  done: [{ id: 'card_web_3', title: 'WEB-3 CSP rollout', category: 'Sec' }],
};

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card shadow="xs" p={4} mb={4} style={{ cursor: 'grab' }} data-testid={`card-${card.id}`} data-card-id={card.id}>
        <Text size="xs" lineClamp={2}>
          {card.title}
        </Text>
      </Card>
    </div>
  );
}

function MiniColumn({ column, cards }: { column: { id: string; title: string }; cards: KanbanCard[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 100,
        padding: 4,
        background: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 4,
        border: `1px solid ${isOver ? '#228be6' : '#dee2e6'}`,
      }}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
    >
      <Text fw={600} size="xs" mb={4}>
        {column.title}
      </Text>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 40 }}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
}

interface RowBoardProps {
  boardInstance: string;
  boardDataId: string;
  pending: KanbanBoardState;
  setPending: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
  setCommitted: React.Dispatch<React.SetStateAction<KanbanBoardState>>;
  isDirty: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  saveSlot?: React.ReactNode;
}

function RowBoard({
  boardInstance,
  boardDataId,
  pending,
  setPending,
  setCommitted,
  isDirty,
  setDirty,
  saveSlot,
}: RowBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const findContainer = (id: string, state: KanbanBoardState): string | undefined => {
    if (miniColumns.some((c) => c.id === id)) return id;
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
    <Box data-board-instance={boardInstance}>
      <Group justify="flex-end" align="flex-start" wrap="nowrap" gap="xs" mb={6}>
        {saveSlot ?? (
          isDirty ? (
            <Button size="compact-xs" onClick={handleSave}>
              Save
            </Button>
          ) : null
        )}
      </Group>
      <Box data-testid="kanban-board" data-board-id={boardDataId}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Group gap={6} align="stretch" wrap="nowrap">
            {miniColumns.map((column) => (
              <MiniColumn key={column.id} column={column} cards={pending[column.id] || []} />
            ))}
          </Group>
          <DragOverlay>
            {activeCard ? (
              <Card shadow="sm" p={4} style={{ cursor: 'grabbing' }}>
                <Text size="xs">{activeCard.title}</Text>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
    </Box>
  );
}

export default function T46({ onSuccess }: TaskComponentProps) {
  const mobileInit = useMemo(() => JSON.parse(JSON.stringify(initialMobile)) as KanbanBoardState, []);
  const webInit = useMemo(() => JSON.parse(JSON.stringify(initialWeb)) as KanbanBoardState, []);

  const [mobCommitted, setMobCommitted] = useState(() => JSON.parse(JSON.stringify(mobileInit)));
  const [mobPending, setMobPending] = useState(() => JSON.parse(JSON.stringify(mobileInit)));
  const [mobDirty, setMobDirty] = useState(false);

  const [webCommitted, setWebCommitted] = useState(() => JSON.parse(JSON.stringify(webInit)));
  const [webPending, setWebPending] = useState(() => JSON.parse(JSON.stringify(webInit)));
  const [webDirty, setWebDirty] = useState(false);

  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const done = mobCommitted.done || [];
    const bottomOk = done.length > 0 && done[done.length - 1]?.id === 'card_app_3';
    const webPristine =
      !webDirty && serializeBoardState(webCommitted) === serializeBoardState(webInit);
    const mobClean = !mobDirty && bottomOk;
    if (mobClean && webPristine) {
      successFired.current = true;
      onSuccess();
    }
  }, [mobCommitted, mobDirty, webCommitted, webDirty, webInit, onSuccess]);

  const handleMobileSave = () => {
    setMobCommitted(JSON.parse(JSON.stringify(mobPending)));
    setMobDirty(false);
  };

  return (
    <Box p="xs" style={{ maxWidth: 720, marginLeft: 'auto' }}>
      <Text size="xs" c="dimmed" mb="sm">
        Release table · expanded rows · high clutter
      </Text>
      <Table withTableBorder withColumnBorders verticalSpacing="xs" fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '28%' }}>Application</Table.Th>
            <Table.Th>Release mini-board</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td valign="top">
              <Text fw={600}>Web app</Text>
              <Text size="xs" c="dimmed">
                Stable channel
              </Text>
            </Table.Td>
            <Table.Td>
              <RowBoard
                boardInstance="Web app"
                boardDataId="web_app_row"
                pending={webPending}
                setPending={setWebPending}
                setCommitted={setWebCommitted}
                isDirty={webDirty}
                setDirty={setWebDirty}
                saveSlot={null}
              />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td valign="top">
              <Text fw={600}>Mobile app</Text>
              <Text size="xs" c="dimmed">
                Target row
              </Text>
            </Table.Td>
            <Table.Td>
              <RowBoard
                boardInstance="Mobile app"
                boardDataId="mobile_app_row"
                pending={mobPending}
                setPending={setMobPending}
                setCommitted={setMobCommitted}
                isDirty={mobDirty}
                setDirty={setMobDirty}
                saveSlot={
                  mobDirty ? (
                    <Button size="compact-xs" onClick={handleMobileSave} data-testid="save-mobile-row">
                      Save
                    </Button>
                  ) : null
                }
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Box>
  );
}
