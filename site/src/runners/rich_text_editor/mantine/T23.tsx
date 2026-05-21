'use client';

/**
 * rich_text_editor-mantine-T23: Create a nested bulleted list (dark + compact)
 *
 * The scene is a centered card in dark theme with compact spacing.
 * One RichTextEditor labeled "Work breakdown" starts empty.
 * The toolbar includes BulletList. Indenting/outdenting list items can be done with Tab/Shift+Tab
 * inside a list (using tiptap list commands).
 * No Save button. Controls are denser due to compact spacing and the dark theme reduces contrast slightly.
 *
 * Success: The document is a bullet list with two top-level items: "Frontend" and "Backend".
 * The "Backend" item contains a nested bullet list with a single item "API".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

export default function T23({ onSuccess }: TaskComponentProps) {
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
      if (items.length !== 2) return;
      
      // First item: "Frontend" (no children)
      const item1 = items[0];
      if (item1.type !== 'listItem') return;
      const item1Text = getListItemText(item1);
      if (normalizeText(item1Text) !== 'Frontend') return;
      // Should not have nested list
      if (hasNestedList(item1)) return;
      
      // Second item: "Backend" with nested list containing "API"
      const item2 = items[1];
      if (item2.type !== 'listItem') return;
      const item2Text = getListItemDirectText(item2);
      if (normalizeText(item2Text) !== 'Backend') return;
      
      // Check for nested bullet list with "API"
      const nestedList = findNestedBulletList(item2);
      if (!nestedList) return;
      
      const nestedItems = nestedList.content || [];
      if (nestedItems.length !== 1) return;
      
      const nestedItem = nestedItems[0];
      if (nestedItem.type !== 'listItem') return;
      if (normalizeText(getListItemText(nestedItem)) !== 'API') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 450 }} data-testid="rte-work-breakdown">
      <Text fw={600} size="md" mb="xs">
        Work breakdown
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Bullets: Frontend; Backend (with sub-bullet: API)
      </Text>
      <RichTextEditor editor={editor} styles={{ root: { fontSize: '0.875rem' } }}>
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
      <Text size="xs" c="dimmed" mt="sm">
        Tip: Use Tab to indent, Shift+Tab to outdent
      </Text>
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
      if (node.type === 'bulletList' || node.type === 'orderedList') {
        return []; // Don't include nested list text
      }
      return node.text || '';
    })
    .join('');
}

function getListItemDirectText(item: any): string {
  if (!item.content) return '';
  const paragraphs = item.content.filter((n: any) => n.type === 'paragraph');
  return paragraphs
    .flatMap((p: any) => p.content?.map((t: any) => t.text || '') || [])
    .join('');
}

function hasNestedList(item: any): boolean {
  if (!item.content) return false;
  return item.content.some((n: any) => n.type === 'bulletList' || n.type === 'orderedList');
}

function findNestedBulletList(item: any): any {
  if (!item.content) return null;
  return item.content.find((n: any) => n.type === 'bulletList');
}
