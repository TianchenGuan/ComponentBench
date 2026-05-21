'use client';

/**
 * json_editor-mui-T08: Drag to reorder priority array (order-sensitive)
 *
 * Page shows a centered MUI Card titled "Priority order (JSON)".
 * A single JSON editor starts in Tree mode.
 * The JSON includes an array field priority. Each item row in the array shows a drag handle used for reordering.
 * A Save button below the editor commits the JSON.
 * Initial JSON value:
 * {
 *   "priority": ["P3", "P1", "P2"],
 *   "label": "Support queue"
 * }
 * Only the order of the priority array determines success.
 *
 * Success: The committed JSON value at path $.priority equals ["P1", "P2", "P3"] after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, List, ListItem, Stack } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, jsonEquals } from '../types';

const INITIAL_JSON = {
  priority: ['P3', 'P1', 'P2'],
  label: 'Support queue'
};

const TARGET_PRIORITY = ['P1', 'P2', 'P3'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const priority = getJsonPath(committedValue, '$.priority');
    if (Array.isArray(priority) && jsonEquals(priority, TARGET_PRIORITY)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleSave = () => {
    setCommittedValue(jsonValue);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const obj = jsonValue as { priority: string[]; label: string };
    const newPriority = [...obj.priority];
    const [removed] = newPriority.splice(draggedIndex, 1);
    newPriority.splice(index, 0, removed);
    setJsonValue({ ...obj, priority: newPriority });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const obj = jsonValue as { priority: string[]; label: string };

  return (
    <Paper elevation={2} sx={{ width: 420, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>Priority order (JSON)</Typography>

      <Box sx={{ minHeight: 200, mb: 2 }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>priority:</Typography>
        <List sx={{ border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fafafa' }}>
          {obj.priority.map((item, index) => (
            <ListItem
              key={`${item}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              sx={{
                cursor: 'grab',
                bgcolor: draggedIndex === index ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
                borderBottom: '1px solid #e0e0e0',
                '&:last-child': { borderBottom: 'none' },
              }}
              data-testid={`priority-item-${index}`}
            >
              <DragIndicatorIcon sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }} />
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>"{item}"</Typography>
            </ListItem>
          ))}
        </List>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>label:</Typography>
          <TextField
            size="small"
            value={obj.label}
            onChange={(e) => setJsonValue({ ...obj, label: e.target.value })}
            sx={{ width: 200 }}
          />
        </Stack>
      </Box>

      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Paper>
  );
}
