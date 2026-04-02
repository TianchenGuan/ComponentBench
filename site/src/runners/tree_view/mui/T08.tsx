'use client';

/**
 * tree_view-mui-T08: Drag-reorder inside Company folder (RichTreeViewPro)
 *
 * Layout: isolated_card centered titled "File Explorer". Contains a RichTreeView with drag-and-drop
 * reordering enabled. The tree is expanded to show Documents → Company.
 *
 * Inside Company (parent id=docs/company), current child order is:
 * 1) Invoice (docs/company/invoice)
 * 2) Meeting notes (docs/company/meeting)
 * 3) Tasks list (docs/company/tasks)
 * 4) Equipment (docs/company/equipment) [TARGET to move]
 *
 * Goal: drag "Equipment" so it becomes position #1 under Company.
 *
 * Success: Within parent 'docs/company', the ordered children ids equal [equipment, invoice, meeting, tasks] exactly.
 * 
 * Note: Since RichTreeViewPro with itemsReordering requires MUI X Pro license which may not be available,
 * we implement a simplified version using state management to simulate drag reordering.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import { DragIndicator, InsertDriveFile, Folder } from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../types';
import { arraysEqual } from '../types';

interface FileItem {
  id: string;
  label: string;
}

const initialCompanyItems: FileItem[] = [
  { id: 'docs/company/invoice', label: 'Invoice' },
  { id: 'docs/company/meeting', label: 'Meeting notes' },
  { id: 'docs/company/tasks', label: 'Tasks list' },
  { id: 'docs/company/equipment', label: 'Equipment' },
];

const targetOrder = ['docs/company/equipment', 'docs/company/invoice', 'docs/company/meeting', 'docs/company/tasks'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FileItem[]>(initialCompanyItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    const currentOrder = items.map(item => item.id);
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [items, onSuccess]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Card sx={{ width: 400 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>File Explorer</Typography>
        
        {/* Static tree structure showing hierarchy */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 0 }}>
          <Folder fontSize="small" />
          <Typography>Documents</Typography>
        </Box>
        
        <Box sx={{ pl: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Folder fontSize="small" />
            <Typography>Company</Typography>
          </Box>
          
          {/* Draggable items inside Company */}
          <List dense sx={{ pl: 3 }}>
            {items.map((item, index) => (
              <ListItem
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  cursor: 'grab',
                  bgcolor: draggedIndex === index ? 'action.selected' : 'transparent',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                data-testid={`item-${item.id}`}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DragIndicator fontSize="small" sx={{ color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <InsertDriveFile fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Pictures folder (collapsed) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pl: 0 }}>
          <Folder fontSize="small" />
          <Typography color="text.secondary">Pictures</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
