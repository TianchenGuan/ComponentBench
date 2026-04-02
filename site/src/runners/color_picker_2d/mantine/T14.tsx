'use client';

/**
 * color_picker_2d-mantine-T14: Table cell: set Editor role color from dense swatches
 *
 * Layout: table_cell scene anchored near the top-left of the viewport.
 * Density: compact spacing is enabled and the table cells are tight; ColorInput triggers appear as small swatches inside cells.
 * The table has two rows with ColorInput in the "Role color" column:
 *   • Reader role color
 *   • Editor role color (target)
 * Instances: 2 ColorInput components total, visually similar.
 * Each ColorInput opens a dropdown with the 2D picker panel plus a dense swatch grid (swatchesPerRow=12).
 * Initial state: Reader=#868E96, Editor=#2E2E2E. The task requires changing only Editor to #4C6EF5.
 * Clutter: the table header includes a search box and a filter chip row.
 *
 * Success: Editor role color value represents color RGBA(76, 110, 245, 1.0).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Table, TextInput, Badge, Group } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 76, g: 110, b: 245, a: 1.0 };

const DENSE_SWATCHES = [
  '#2e2e2e', '#495057', '#868e96', '#adb5bd', '#ced4da', '#dee2e6',
  '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6',
  '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14',
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [readerColor, setReaderColor] = useState('#868E96');
  const [editorColor, setEditorColor] = useState('#2E2E2E');
  const [search, setSearch] = useState('');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    
    const rgba = hexToRgba(editorColor);
    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [editorColor, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 480 }}>
      <Text fw={600} size="md" mb="sm">Roles</Text>
      <Text size="xs" c="dimmed" mb="sm">Roles table → Editor role color</Text>
      
      {/* Search and filters */}
      <Group mb="sm" gap="xs">
        <TextInput
          placeholder="Search roles..."
          size="xs"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: 150 }}
        />
        <Badge size="sm" variant="light">All</Badge>
        <Badge size="sm" variant="outline">Active</Badge>
      </Group>
      
      {/* Table */}
      <Table withTableBorder withColumnBorders striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Role</Table.Th>
            <Table.Th>Permissions</Table.Th>
            <Table.Th>Role color</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Reader</Table.Td>
            <Table.Td>View only</Table.Td>
            <Table.Td>
              <ColorInput
                value={readerColor}
                onChange={setReaderColor}
                format="hex"
                swatches={DENSE_SWATCHES}
                swatchesPerRow={12}
                withPicker
                size="xs"
                style={{ width: 100 }}
                data-testid="role-reader-color"
              />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Editor</Table.Td>
            <Table.Td>Edit, Comment</Table.Td>
            <Table.Td>
              <ColorInput
                value={editorColor}
                onChange={setEditorColor}
                format="hex"
                swatches={DENSE_SWATCHES}
                swatchesPerRow={12}
                withPicker
                size="xs"
                style={{ width: 100 }}
                data-testid="role-editor-color"
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      
      <Text size="xs" c="dimmed" mt="sm">
        Set Editor role color to #4C6EF5.
      </Text>
    </Card>
  );
}
