'use client';

/**
 * Task ID: drag_drop_between_lists-mui-T05
 * Task Name: Search within a form to add a metric
 *
 * Setup Description:
 * Scene is a report-builder form section. At top: TextField 'Report name', Select 'Time range',
 * and Cancel/Save buttons. Midway: 'Favorite metrics' section with drag-and-drop between-lists.
 * Available metrics has a search TextField at top.
 *
 * Initial state:
 * - Favorite metrics: Revenue
 * - Available metrics: Active users, Bounce rate, Conversion rate, Customer Acquisition Cost,
 *   Net promoter score, Orders, Page views, Refund rate, Sessions, Churn rate
 *
 * Success: Use search to find 'Churn rate' and move it to Favorite metrics
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
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
import type { TaskComponentProps, DraggableItem, ContainerState } from '../types';

const availableMetricsList = [
  'Active users', 'Bounce rate', 'Conversion rate', 'Customer Acquisition Cost',
  'Net promoter score', 'Orders', 'Page views', 'Refund rate', 'Sessions', 'Churn rate'
];

const initialContainers: ContainerState = {
  available: availableMetricsList.map(m => ({ id: m.toLowerCase().replace(/\s+/g, '-'), label: m })),
  favorite: [{ id: 'revenue', label: 'Revenue' }],
};

function SortableItem({ item }: { item: DraggableItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <ListItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 0.5,
        py: 0.75,
        bgcolor: 'background.paper',
        cursor: 'grab',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      data-testid={`dnd-item-${item.id}`}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
      </ListItemIcon>
      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13 }} />
    </ListItem>
  );
}

function DroppableContainer({
  id,
  title,
  items,
  searchInput,
}: {
  id: string;
  title: string;
  items: DraggableItem[];
  searchInput?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 180,
        p: 1.5,
        bgcolor: isOver ? 'primary.50' : 'grey.100',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isOver ? 'primary.main' : 'grey.300',
        borderRadius: 1,
        transition: 'all 0.2s',
      }}
      data-testid={`dnd-container-${id}`}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 12 }}>{title}</Typography>
      {searchInput}
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <List sx={{ minHeight: 100, maxHeight: 200, overflowY: 'auto', p: 0 }}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </List>
      </SortableContext>
    </Paper>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [containers, setContainers] = useState<ContainerState>(initialContainers);
  const [searchText, setSearchText] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const successFired = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredAvailable = useMemo(() => {
    if (!searchText) return containers.available;
    return containers.available.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [containers.available, searchText]);

  // Check success condition
  useEffect(() => {
    if (successFired.current) return;
    const favoriteLabels = containers.favorite.map(i => i.label);
    if (favoriteLabels.includes('Revenue') && favoriteLabels.includes('Churn rate')) {
      successFired.current = true;
      onSuccess();
    }
  }, [containers, onSuccess]);

  const findContainer = (id: string): string | undefined => {
    if (id in containers) return id;
    for (const [containerId, items] of Object.entries(containers)) {
      if (items.some(item => item.id === id)) return containerId;
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

    setContainers(prev => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex(item => item.id === active.id);
      const activeItem = activeItems[activeIndex];

      activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex(item => item.id === over.id);
      if (overIndex === -1) overItems.push(activeItem);
      else overItems.splice(overIndex, 0, activeItem);

      return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems };
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
      const items = containers[activeContainer];
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== newIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
  };

  const activeItem = activeId ? Object.values(containers).flat().find(item => item.id === activeId) : null;

  return (
    <Box sx={{ width: 520 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Report Builder</Typography>
      
      {/* Form controls (clutter) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField label="Report name" size="small" sx={{ flex: 1 }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time range</InputLabel>
          <Select label="Time range" defaultValue="30d">
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button variant="outlined" size="small">Cancel</Button>
        <Button variant="contained" size="small">Save report</Button>
      </Box>

      {/* Favorite metrics section */}
      <Paper elevation={1} sx={{ p: 2 }} data-testid="favorite-metrics-section">
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>Favorite metrics</Typography>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <DroppableContainer
              id="available"
              title="Available metrics"
              items={filteredAvailable}
              searchInput={
                <TextField
                  size="small"
                  placeholder="Search metrics"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1, width: '100%' }}
                  data-testid="metrics-search"
                />
              }
            />
            <DroppableContainer
              id="favorite"
              title="Favorite metrics"
              items={containers.favorite}
            />
          </div>

          <DragOverlay>
            {activeItem ? (
              <Paper elevation={4} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: 'primary.main' }}>
                <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2">{activeItem.label}</Typography>
              </Paper>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Paper>
    </Box>
  );
}
