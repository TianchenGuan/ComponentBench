'use client';

/**
 * toolbar-mui-T09: Reorder quick actions in toolbar and save
 *
 * An isolated card is anchored to the bottom-right of the viewport. It contains a single 
 * MUI Toolbar labeled "Quick actions".
 * The toolbar shows four action chips with icons and labels: "Reply", "Forward", "Archive", 
 * and "Delete". Initially the order is: Delete, Archive, Reply, Forward.
 * Target order: Reply, Forward, Archive, Delete.
 * At the far right there is an IconButton labeled "Edit order" that toggles reorder mode.
 * When reorder mode is on, each chip shows a drag handle and a "Save" button appears.
 */

import React, { useState } from 'react';
import {
  Paper,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import type { TaskComponentProps } from '../types';

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const INITIAL_ORDER: ActionItem[] = [
  { id: 'delete', label: 'Delete', icon: <DeleteIcon fontSize="small" /> },
  { id: 'archive', label: 'Archive', icon: <ArchiveIcon fontSize="small" /> },
  { id: 'reply', label: 'Reply', icon: <ReplyIcon fontSize="small" /> },
  { id: 'forward', label: 'Forward', icon: <ForwardIcon fontSize="small" /> },
];

const TARGET_ORDER = ['reply', 'forward', 'archive', 'delete'];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ORDER);
  const [editMode, setEditMode] = useState(false);
  const [committedOrder, setCommittedOrder] = useState<string[]>(
    INITIAL_ORDER.map((a) => a.id)
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newActions = [...actions];
    const [draggedItem] = newActions.splice(draggedIndex, 1);
    newActions.splice(index, 0, draggedItem);
    setActions(newActions);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const currentOrder = actions.map((a) => a.id);
    setCommittedOrder(currentOrder);
    setEditMode(false);

    if (JSON.stringify(currentOrder) === JSON.stringify(TARGET_ORDER)) {
      onSuccess();
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 450, p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Quick actions
      </Typography>
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: 'grey.100',
          borderRadius: 1,
          display: 'flex',
          gap: 1,
          minHeight: 48,
        }}
        data-testid="mui-toolbar-quick-actions"
      >
        {actions.map((action, index) => (
          <Box
            key={action.id}
            draggable={editMode}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: editMode ? 'grab' : 'default',
            }}
            data-action-id={action.id}
          >
            {editMode && (
              <DragIndicatorIcon
                fontSize="small"
                sx={{ color: 'text.secondary', cursor: 'grab' }}
              />
            )}
            <Chip
              icon={action.icon as React.ReactElement}
              label={action.label}
              size="small"
              variant="outlined"
            />
          </Box>
        ))}

        <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
          {!editMode ? (
            <Tooltip title="Edit order">
              <IconButton
                size="small"
                onClick={() => setEditMode(true)}
                aria-label="Edit order"
                data-testid="mui-toolbar-quick-actions-edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              data-testid="mui-toolbar-quick-actions-save"
            >
              Save
            </Button>
          )}
        </Box>
      </Toolbar>

      {editMode && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Drag to reorder
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current order: {committedOrder.join(', ')}
        </Typography>
      </Box>
    </Paper>
  );
}
