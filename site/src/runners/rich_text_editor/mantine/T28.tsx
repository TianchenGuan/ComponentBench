'use client';

/**
 * rich_text_editor-mantine-T28: Reply in the correct table row
 *
 * The page uses a table_cell layout: a small two-row orders table is centered with a simple
 * header row and minimal surrounding UI.
 * Each row has a "Reply" column containing a compact RichTextEditor (toolbar visible but small)
 * for drafting a response.
 * Row 1: "Order #1842" (Reply editor empty)
 * Row 2: "Order #1843" (Reply editor pre-filled: "Checking status.")
 * Both editors look identical; correct row selection is required.
 * No Save button: drafts are stored live per row.
 *
 * Success: The Reply editor in row "Order #1842" has plain text exactly "Refund approved."
 * The Reply editor in row "Order #1843" remains "Checking status."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Table, Badge, Group } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const TARGET_REPLY = 'Refund approved.';
const INITIAL_REPLY_1843 = 'Checking status.';

export default function T28({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor1842 = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  const editor1843 = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: `<p>${INITIAL_REPLY_1843}</p>`,
  });

  useEffect(() => {
    if (!editor1842 || !editor1843 || successFired.current) return;

    const checkSuccess = () => {
      const text1842 = editor1842.getText();
      const text1843 = editor1843.getText();
      
      const match1842 = textsMatch(text1842, TARGET_REPLY, { normalize: true, ignoreTrailingNewline: true });
      const match1843 = textsMatch(text1843, INITIAL_REPLY_1843, { normalize: true, ignoreTrailingNewline: true });
      
      if (match1842 && match1843) {
        successFired.current = true;
        onSuccess();
      }
    };

    editor1842.on('update', checkSuccess);
    editor1843.on('update', checkSuccess);
    
    return () => {
      editor1842.off('update', checkSuccess);
      editor1843.off('update', checkSuccess);
    };
  }, [editor1842, editor1843, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="orders-table-card">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Orders table</Text>
        <Group gap="xs">
          <Badge color="gray" variant="outline">All</Badge>
          <Badge color="blue" variant="outline">Pending</Badge>
        </Group>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md">
        Row: Order #1842 → Reply editor = "Refund approved."
      </Text>
      
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 120 }}>Order</Table.Th>
            <Table.Th style={{ width: 100 }}>Status</Table.Th>
            <Table.Th>Reply</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr data-testid="orders-row-1842">
            <Table.Td>
              <Text fw={500}>Order #1842</Text>
            </Table.Td>
            <Table.Td>
              <Badge color="yellow" size="sm">Pending</Badge>
            </Table.Td>
            <Table.Td>
              <RichTextEditor editor={editor1842} styles={{ root: { fontSize: '0.8rem' } }}>
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content data-testid="orders-row-1842-reply-editor" />
              </RichTextEditor>
            </Table.Td>
          </Table.Tr>
          <Table.Tr data-testid="orders-row-1843">
            <Table.Td>
              <Text fw={500}>Order #1843</Text>
            </Table.Td>
            <Table.Td>
              <Badge color="blue" size="sm">Processing</Badge>
            </Table.Td>
            <Table.Td>
              <RichTextEditor editor={editor1843} styles={{ root: { fontSize: '0.8rem' } }}>
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content data-testid="orders-row-1843-reply-editor" />
              </RichTextEditor>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
