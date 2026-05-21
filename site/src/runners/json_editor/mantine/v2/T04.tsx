'use client';

/**
 * json_editor-mantine-v2-T04: Columns reorder in dense table cell
 *
 * Table row "Visible columns" with a JSON tree editor with drag handles.
 * Reorder `columns` from ["email","id","createdAt"] to ["id","email","createdAt"].
 * Click "Save row".
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper, Text, Button, Group, Box, Table } from '@mantine/core';
import { IconGripVertical, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const INITIAL_JSON: JsonValue = { columns: ['email', 'id', 'createdAt'] };

export default function T04({ onSuccess }: TaskComponentProps) {
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [committed, setCommitted] = useState<JsonValue>(INITIAL_JSON);
  const successFired = useRef(false);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    const columns = getJsonPath(committed, '$.columns');
    if (Array.isArray(columns) && jsonEquals(columns as JsonValue[], ['id', 'email', 'createdAt'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const obj = json as { columns: string[] };

  const moveItem = useCallback((from: number, to: number) => {
    const arr = [...obj.columns];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setJson({ ...obj, columns: arr });
  }, [obj]);

  return (
    <Box p="md">
      <Paper shadow="sm" withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Setting</Table.Th>
              <Table.Th>Configuration</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td style={{ verticalAlign: 'top', width: 160 }}>
                <Text size="sm" fw={600}>Sort order</Text>
              </Table.Td>
              <Table.Td>
                <Text size="xs" c="dimmed">createdAt DESC</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td style={{ verticalAlign: 'top', width: 160 }}>
                <Text size="sm" fw={600}>Visible columns</Text>
              </Table.Td>
              <Table.Td>
                <Text size="xs" ff="monospace" mb={4}>columns:</Text>
                {obj.columns.map((item, idx) => (
                  <Box
                    key={`${item}-${idx}`}
                    draggable
                    onDragStart={() => { dragIdx.current = idx; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIdx.current !== null && dragIdx.current !== idx) moveItem(dragIdx.current, idx);
                      dragIdx.current = null;
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '3px 8px', marginBottom: 2,
                      background: '#f8f9fa', border: '1px solid #e9ecef',
                      borderRadius: 4, cursor: 'grab',
                    }}
                  >
                    <IconGripVertical size={14} style={{ color: '#adb5bd', cursor: 'grab' }} />
                    <Text size="sm" ff="monospace" style={{ flex: 1 }}>{JSON.stringify(item)}</Text>
                    <Group gap={2}>
                      <Button
                        size="compact-xs" variant="subtle"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, idx - 1)}
                      >
                        <IconArrowUp size={12} />
                      </Button>
                      <Button
                        size="compact-xs" variant="subtle"
                        disabled={idx === obj.columns.length - 1}
                        onClick={() => moveItem(idx, idx + 1)}
                      >
                        <IconArrowDown size={12} />
                      </Button>
                    </Group>
                  </Box>
                ))}
                <Button size="xs" mt="xs" onClick={() => setCommitted(json)}>Save row</Button>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td style={{ verticalAlign: 'top', width: 160 }}>
                <Text size="sm" fw={600}>Page size</Text>
              </Table.Td>
              <Table.Td>
                <Text size="xs" c="dimmed">25</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Box>
  );
}
