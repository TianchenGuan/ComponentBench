'use client';

/**
 * rich_text_editor-mantine-v2-T02: Floating-menu rollback snippet
 *
 * Dashboard panel with metric tiles and a timeline. The editor "Release snippet" starts empty.
 * A FloatingMenu appears on empty lines with Heading and Bullet List controls.
 * Create H3 "Rollback" + bullet list ["Stop traffic", "Restore backup"], then click "Save snippet".
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Group, Stack, Paper } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const handleSave = () => {
    if (!editor || successFired.current) return;
    setSaved(true);

    const json = editor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 2) return;

    const heading = content[0];
    if (heading.type !== 'heading' || heading.attrs?.level !== 3) return;
    if (normalizeText(getTextFromBlock(heading)) !== 'Rollback') return;

    const bulletList = content[1];
    if (bulletList.type !== 'bulletList') return;

    const items = bulletList.content || [];
    if (items.length !== 2) return;

    const expected = ['Stop traffic', 'Restore backup'];
    for (let i = 0; i < 2; i++) {
      if (items[i].type !== 'listItem') return;
      if (normalizeText(getListItemText(items[i])) !== expected[i]) return;
    }

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, width: 850 }}>
      <Stack gap="sm" style={{ width: 180 }}>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Deploys today</Text>
          <Text fw={700} size="lg">14</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Failures</Text>
          <Text fw={700} size="lg" c="red">2</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Avg latency</Text>
          <Text fw={700} size="lg">42ms</Text>
        </Paper>
        <Card withBorder p="xs">
          <Text size="xs" fw={500} mb={4}>Timeline</Text>
          <Text size="xs" c="dimmed">10:00 — Deploy started</Text>
          <Text size="xs" c="dimmed">10:05 — Health check pass</Text>
          <Text size="xs" c="dimmed">10:12 — Canary promoted</Text>
        </Card>
      </Stack>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="xs">Release snippet</Text>
        <Text size="sm" c="dimmed" mb="sm">
          Use the empty-line quick insert menu to create H3 "Rollback" + bullets ["Stop traffic", "Restore backup"].
        </Text>

        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content style={{ minHeight: 150 }} />
        </RichTextEditor>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleSave}>Save snippet</Button>
        </Group>
      </Card>
    </div>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
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
