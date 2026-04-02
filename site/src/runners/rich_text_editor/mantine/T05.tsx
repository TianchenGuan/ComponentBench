'use client';

/**
 * rich_text_editor-mantine-T05: Create a bulleted checklist
 *
 * The page shows a simple form_section layout (a "Project form" header with a few disabled text inputs
 * as context: Project name, Owner). Below them is one RichTextEditor labeled "Checklist".
 * The editor is empty initially. The toolbar includes BulletList and OrderedList controls.
 * No Save button is required for success; editor updates live.
 * Clutter is low: a couple of non-interactive help texts and a disabled "Submit" button are visible but not needed.
 *
 * Success: The "Checklist" editor contains a bullet list with exactly three items in this order:
 * "Buy milk", "Send invoice", "Book flights".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, TextInput, Button, Stack } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

const TARGET_ITEMS = ['Buy milk', 'Send invoice', 'Book flights'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const content = json.content || [];
      
      // Find bullet list
      const bulletList = content.find((block: any) => block.type === 'bulletList');
      if (!bulletList) return;
      
      const items = bulletList.content || [];
      if (items.length !== TARGET_ITEMS.length) return;
      
      // Check each item
      for (let i = 0; i < TARGET_ITEMS.length; i++) {
        const item = items[i];
        if (item.type !== 'listItem') return;
        
        const itemText = getListItemText(item);
        if (normalizeText(itemText) !== TARGET_ITEMS[i]) return;
      }
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-checklist">
      <Text fw={600} size="lg" mb="md">
        Project form
      </Text>
      
      <Stack gap="md" mb="lg">
        <TextInput
          label="Project name"
          value="Website Redesign"
          disabled
        />
        <TextInput
          label="Owner"
          value="Jane Doe"
          disabled
        />
      </Stack>
      
      <Text fw={500} mb="xs">
        Checklist
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Create bullets: Buy milk / Send invoice / Book flights
      </Text>
      
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
      
      <Text size="xs" c="dimmed" mt="md">
        Changes are saved automatically.
      </Text>
      <Button disabled mt="md">Submit</Button>
    </Card>
  );
}

function getListItemText(item: any): string {
  if (!item.content) return '';
  return item.content
    .flatMap((node: any) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.map((t: any) => t.text || '');
      }
      return node.text || '';
    })
    .join('');
}
