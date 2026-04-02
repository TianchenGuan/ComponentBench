'use client';

/**
 * Task ID: drag_drop_between_lists-mantine-v2-T29
 * Task Name: Mantine: EU markets row only with exact save
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Group, Paper, Table, Text } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskComponentProps, DraggableItem, ContainerState } from '../../types';
import { checkExactOrder } from '../../types';

/** US row is static (read-only) so it cannot be altered. EU row is interactive. */
const usDisplay = {
  enabled: ['California', 'Texas'],
  disabled: ['Germany', 'Nevada'],
};

const initialEu: ContainerState = {
  'eu-enabled': [{ id: 'spa-eu', label: 'Spain' }],
  'eu-disabled': [
    { id: 'ger-eu', label: 'Germany' },
    { id: 'fra-eu', label: 'France' },
    { id: 'ita-eu', label: 'Italy' },
  ],
};

const targetEu = {
  'Disabled markets': ['Italy'],
  'Enabled markets': ['Spain', 'Germany', 'France'],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '4px 8px',
        backgroundColor: '#fff',
        border: '1px solid #ced4da',
        borderRadius: 4,
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
      data-testid={`dnd-item-${item.id}`}
    >
      <IconGripVertical size={12} color="#adb5bd" />
      <Text size="xs" fw={500} c="#868e96">
        {item.label}
      </Text>
    </Box>
  );
}

function EuDroppable({
  id,
  title,
  items,
  isOver,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 100,
        padding: 6,
        backgroundColor: isOver ? '#e7f5ff' : '#f8f9fa',
        borderRadius: 4,
        border: `2px dashed ${isOver ? '#228be6' : '#adb5bd'}`,
      }}
      data-testid={`dnd-container-${id}`}
      aria-label={title}
    >
      <Text fw={700} size="xs" mb={4} c="#495057">
        {title}
      </Text>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box style={{ minHeight: 72 }}>{items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}</Box>
      </SortableContext>
    </Box>
  );
}

export default function T29({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialEu);
  const [committed, setCommitted] = useState<ContainerState>(initialEu);
  const [saved, setSaved] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const mapped = {
      'Disabled markets': committed['eu-disabled'],
      'Enabled markets': committed['eu-enabled'],
    };
    if (checkExactOrder(mapped, targetEu)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, saved, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, list] of Object.entries(containers)) {
      if (list.some((item) => item.id === id)) return containerId;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId((over?.id as string) || null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex((item) => item.id === active.id);
      if (activeIndex === -1) return prev;
      const activeItem = activeItems[activeIndex];
      activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex((item) => item.id === over.id);
      if (overIndex === -1) overItems.push(activeItem);
      else overItems.splice(overIndex, 0, activeItem);
      return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find((item) => item.id === activeId) : null;

  return (
    <Paper
      p="xs"
      radius="md"
      withBorder
      style={{ maxWidth: 560, backgroundColor: '#000', borderColor: '#fff' }}
      data-testid="region-markets-table"
    >
      <Text fw={700} size="sm" c="#fff" mb="xs">
        Region markets
      </Text>
      <Table verticalSpacing={4} horizontalSpacing="xs" style={{ color: '#fff' }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ color: '#fff', width: 100 }}>Region</Table.Th>
            <Table.Th style={{ color: '#fff' }}>Enabled markets</Table.Th>
            <Table.Th style={{ color: '#fff' }}>Disabled markets</Table.Th>
            <Table.Th style={{ color: '#fff', width: 72 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr data-task-instance-label="US region">
            <Table.Td>
              <Text size="xs" fw={600} c="#fff">
                US region
              </Text>
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                {usDisplay.enabled.map((x) => (
                  <Box key={x} px={6} py={2} style={{ border: '1px solid #fff', borderRadius: 4, fontSize: 10 }}>
                    {x}
                  </Box>
                ))}
              </Group>
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                {usDisplay.disabled.map((x) => (
                  <Box key={x} px={6} py={2} style={{ border: '1px solid #aaa', borderRadius: 4, fontSize: 10 }}>
                    {x}
                  </Box>
                ))}
              </Group>
            </Table.Td>
            <Table.Td>
              <Button size="compact-xs" variant="default" disabled>
                Save
              </Button>
            </Table.Td>
          </Table.Tr>

          <Table.Tr data-task-instance-label="EU region">
            <Table.Td style={{ verticalAlign: 'top' }}>
              <Text size="xs" fw={600} c="#fff">
                EU region
              </Text>
            </Table.Td>
            <Table.Td colSpan={2} style={{ verticalAlign: 'top' }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <Box style={{ display: 'flex', gap: 8 }}>
                  <EuDroppable
                    id="eu-enabled"
                    title="Enabled markets"
                    items={containers['eu-enabled']}
                    isOver={overId === 'eu-enabled'}
                  />
                  <EuDroppable
                    id="eu-disabled"
                    title="Disabled markets"
                    items={containers['eu-disabled']}
                    isOver={overId === 'eu-disabled'}
                  />
                </Box>
                <DragOverlay>
                  {activeItem ? (
                    <Box
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#fff',
                        border: '1px solid #228be6',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <IconGripVertical size={12} color="#adb5bd" />
                      <Text size="xs" fw={500} c="#868e96">
                        {activeItem.label}
                      </Text>
                    </Box>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </Table.Td>
            <Table.Td style={{ verticalAlign: 'bottom' }}>
              <Button
                size="compact-xs"
                color="blue"
                data-testid="save-eu-row"
                aria-label="save-eu-row"
                onClick={() => {
                  setCommitted({
                    'eu-enabled': [...containers['eu-enabled']],
                    'eu-disabled': [...containers['eu-disabled']],
                  });
                  setSaved(true);
                }}
              >
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
