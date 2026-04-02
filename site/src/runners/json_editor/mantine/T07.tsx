'use client';

/**
 * json_editor-mantine-T07: Reorder columns array in dark theme
 *
 * Page uses a dark theme and shows a centered Mantine Card titled "Table config (JSON)".
 * A single JSON editor starts in Tree mode.
 * The JSON includes an array field columns. Each item row in the array shows a drag handle used to reorder items.
 * A Save button below the editor commits changes.
 * Initial JSON value:
 * {
 *   "columns": ["email", "id", "createdAt"],
 *   "pageSize": 25
 * }
 * Only the order of columns matters; pageSize is a distractor.
 *
 * Success: The committed JSON value at path $.columns equals ["id", "email", "createdAt"] after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Text, Button, TextInput, Stack, Group, Box, MantineProvider, List, ActionIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, jsonEquals } from '../types';

const INITIAL_JSON = {
  columns: ['email', 'id', 'createdAt'],
  pageSize: 25
};

const TARGET_COLUMNS = ['id', 'email', 'createdAt'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const columns = getJsonPath(committedValue, '$.columns');
    if (Array.isArray(columns) && jsonEquals(columns, TARGET_COLUMNS)) {
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

    const obj = jsonValue as { columns: string[]; pageSize: number };
    const newColumns = [...obj.columns];
    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, removed);
    setJsonValue({ ...obj, columns: newColumns });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const obj = jsonValue as { columns: string[]; pageSize: number };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box style={{ background: '#1a1b1e', padding: 24, borderRadius: 8, minHeight: 300 }}>
        <Paper shadow="sm" p="lg" radius="md" withBorder style={{ width: 420 }} data-testid="json-editor-card">
          <Text fw={600} size="lg" mb="md">Table config (JSON)</Text>

          <Box mih={180} mb="md">
            <Text size="sm" ff="monospace" mb="xs">columns:</Text>
            <List spacing="xs" mb="md" style={{ border: '1px solid #373a40', borderRadius: 4, padding: 8 }}>
              {obj.columns.map((col, index) => (
                <List.Item
                  key={`${col}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    cursor: 'grab',
                    background: draggedIndex === index ? '#2c2e33' : 'transparent',
                    padding: '4px 8px',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    listStyle: 'none',
                    marginBottom: 4,
                  }}
                  data-testid={`column-item-${index}`}
                  icon={
                    <ActionIcon variant="subtle" size="sm" style={{ cursor: 'grab' }}>
                      <IconGripVertical size={14} />
                    </ActionIcon>
                  }
                >
                  <Text size="sm" ff="monospace">"{col}"</Text>
                </List.Item>
              ))}
            </List>

            <Group gap="xs">
              <Text size="sm" ff="monospace" w={80}>pageSize:</Text>
              <TextInput
                size="xs"
                type="number"
                value={obj.pageSize}
                onChange={(e) => setJsonValue({ ...obj, pageSize: Number(e.target.value) })}
                style={{ width: 80 }}
              />
            </Group>
          </Box>

          <Button onClick={handleSave}>Save</Button>
        </Paper>
      </Box>
    </MantineProvider>
  );
}
