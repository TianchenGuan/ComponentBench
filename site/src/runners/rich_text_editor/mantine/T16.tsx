'use client';

/**
 * rich_text_editor-mantine-T16: Use undo in a dashboard widget
 *
 * The scene uses a dashboard layout with multiple metric cards (non-interactive) as medium clutter.
 * In the bottom-left quadrant is a widget titled "KPI note" containing a RichTextEditor labeled "KPI note".
 * The editor currently contains a single paragraph: "KPI summary (edited)".
 * The toolbar is visible and includes Undo/Redo controls. No Save button; changes apply immediately.
 *
 * Success: The "KPI note" editor plain text equals exactly "KPI summary".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, SimpleGrid, Paper, Group, RingProgress, Center } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const TARGET_TEXT = 'KPI summary';

export default function T16({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>KPI summary (edited)</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      
      if (textsMatch(plainText, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        successFired.current = true;
        onSuccess();
      }
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <div style={{ width: '100%', maxWidth: 900 }} data-testid="dashboard">
      <Text fw={600} size="xl" mb="lg">
        Dashboard
      </Text>
      
      <SimpleGrid cols={2} spacing="md">
        {/* Metric Cards (clutter) */}
        <Paper p="md" radius="md" withBorder>
          <Text size="sm" c="dimmed" mb="xs">Revenue</Text>
          <Text size="xl" fw={700}>$124,500</Text>
          <Text size="xs" c="green">+12.5%</Text>
        </Paper>
        
        <Paper p="md" radius="md" withBorder>
          <Text size="sm" c="dimmed" mb="xs">Active Users</Text>
          <Text size="xl" fw={700}>8,432</Text>
          <Text size="xs" c="green">+3.2%</Text>
        </Paper>
        
        <Paper p="md" radius="md" withBorder>
          <Group>
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: 72, color: 'blue' }]}
              label={
                <Center>
                  <Text size="xs" fw={700}>72%</Text>
                </Center>
              }
            />
            <div>
              <Text size="sm" c="dimmed">Completion</Text>
              <Text size="lg" fw={600}>72%</Text>
            </div>
          </Group>
        </Paper>
        
        {/* KPI Note Widget (target) */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="kpi-note-widget">
          <Text fw={500} mb="xs">KPI note</Text>
          <Text size="sm" c="dimmed" mb="sm">
            Make it exactly: KPI summary
          </Text>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="kpi-note-editor" />
          </RichTextEditor>
        </Card>
      </SimpleGrid>
    </div>
  );
}
