'use client';

/**
 * rich_text_editor-mantine-T19: Format the correct editor among three
 *
 * An isolated card contains a "Review panel" section with three RichTextEditor instances in a vertical stack:
 * 1) "Public comment" (pre-filled: "Looks good.")
 * 2) "Manager note" (empty)
 * 3) "Legal note" (pre-filled: "No issues found.")
 * All three toolbars look identical, so the label is required for correct targeting.
 * Clutter is low: a couple of read-only tags (Status: Pending) appear above.
 *
 * Success: "Manager note" contains an ordered (numbered) list with exactly two items: "Follow up", then "Escalate".
 * "Public comment" remains "Looks good." and "Legal note" remains "No issues found."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Stack, Badge, Group } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch, normalizeText } from '../types';

const TARGET_ITEMS = ['Follow up', 'Escalate'];

export default function T19({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const publicEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>Looks good.</p>',
  });

  const managerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  const legalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>No issues found.</p>',
  });

  useEffect(() => {
    if (!publicEditor || !managerEditor || !legalEditor || successFired.current) return;

    const checkSuccess = () => {
      // Check public comment unchanged
      const publicText = publicEditor.getText();
      if (!textsMatch(publicText, 'Looks good.', { normalize: true, ignoreTrailingNewline: true })) return;
      
      // Check legal note unchanged
      const legalText = legalEditor.getText();
      if (!textsMatch(legalText, 'No issues found.', { normalize: true, ignoreTrailingNewline: true })) return;
      
      // Check manager note has ordered list with target items
      const json = managerEditor.getJSON();
      const content = json.content || [];
      
      const orderedList = content.find((block: any) => block.type === 'orderedList');
      if (!orderedList) return;
      
      const items = orderedList.content || [];
      if (items.length !== TARGET_ITEMS.length) return;
      
      for (let i = 0; i < TARGET_ITEMS.length; i++) {
        const item = items[i];
        if (item.type !== 'listItem') return;
        if (normalizeText(getListItemText(item)) !== TARGET_ITEMS[i]) return;
      }
      
      successFired.current = true;
      onSuccess();
    };

    publicEditor.on('update', checkSuccess);
    managerEditor.on('update', checkSuccess);
    legalEditor.on('update', checkSuccess);
    
    return () => {
      publicEditor.off('update', checkSuccess);
      managerEditor.off('update', checkSuccess);
      legalEditor.off('update', checkSuccess);
    };
  }, [publicEditor, managerEditor, legalEditor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }} data-testid="review-panel">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Review panel</Text>
        <Badge color="yellow">Status: Pending</Badge>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md">
        Target: Manager note = numbered list [Follow up, Escalate]
      </Text>
      
      <Stack gap="lg">
        <div data-testid="public-comment-section">
          <Text fw={500} mb="xs">Public comment</Text>
          <RichTextEditor editor={publicEditor}>
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
        </div>

        <div data-testid="manager-note-section">
          <Text fw={500} mb="xs">Manager note</Text>
          <RichTextEditor editor={managerEditor}>
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
            <RichTextEditor.Content data-testid="manager-note-editor" />
          </RichTextEditor>
        </div>

        <div data-testid="legal-note-section">
          <Text fw={500} mb="xs">Legal note</Text>
          <RichTextEditor editor={legalEditor}>
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
        </div>
      </Stack>
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
