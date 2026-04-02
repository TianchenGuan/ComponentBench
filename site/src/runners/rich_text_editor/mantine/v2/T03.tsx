'use client';

/**
 * rich_text_editor-mantine-v2-T03: Sticky-toolbar offscreen inline-code edit
 *
 * Nested scroll layout. The editor "How-to" is in a fixed-height ScrollArea with sticky toolbar.
 * The ## Commands section is offscreen. Format only `npm run build` as inline code in
 * "Run npm run build before deployment.", then click "Save how-to".
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const INITIAL_HTML = `<h1>Runbook</h1>
<h2>Summary</h2>
<p>Prepare the release carefully.</p>
<p>Check the staging environment before proceeding.</p>
<p>Coordinate with the on-call team if needed.</p>
<h2>Prerequisites</h2>
<p>Verify all feature flags are set correctly.</p>
<p>Review the deployment checklist one more time.</p>
<p>Confirm that monitoring dashboards are green.</p>
<h2>Commands</h2>
<p>Run npm run build before deployment.</p>
<h2>Notes</h2>
<p>Escalate if staging fails.</p>`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CodeExtension],
    content: INITIAL_HTML,
  });

  const handleSave = () => {
    if (!editor || successFired.current) return;

    const json = editor.getJSON();
    const content = json.content || [];

    const expectedBlocks = [
      { type: 'heading', level: 1, text: 'Runbook' },
      { type: 'heading', level: 2, text: 'Summary' },
      { type: 'paragraph', text: 'Prepare the release carefully.' },
      { type: 'paragraph', text: 'Check the staging environment before proceeding.' },
      { type: 'paragraph', text: 'Coordinate with the on-call team if needed.' },
      { type: 'heading', level: 2, text: 'Prerequisites' },
      { type: 'paragraph', text: 'Verify all feature flags are set correctly.' },
      { type: 'paragraph', text: 'Review the deployment checklist one more time.' },
      { type: 'paragraph', text: 'Confirm that monitoring dashboards are green.' },
      { type: 'heading', level: 2, text: 'Commands' },
      { type: 'paragraph', text: 'Run npm run build before deployment.', hasCode: true },
      { type: 'heading', level: 2, text: 'Notes' },
      { type: 'paragraph', text: 'Escalate if staging fails.' },
    ];

    if (content.length !== expectedBlocks.length) return;

    for (let i = 0; i < expectedBlocks.length; i++) {
      const block = content[i];
      const expected = expectedBlocks[i];
      if (block.type !== expected.type) return;
      if (expected.type === 'heading' && block.attrs?.level !== expected.level) return;
      if (normalizeText(getFullText(block)) !== expected.text) return;
    }

    const html = editor.getHTML();
    const codeMatches = html.match(/<code>([^<]*)<\/code>/g) || [];
    if (codeMatches.length !== 1) return;
    if (!/<code>npm run build<\/code>/.test(html)) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, width: 800 }}>
      <Stack gap="sm" style={{ width: 180 }}>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Build status</Text>
          <Text fw={600} size="sm" c="green">Passing</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Coverage</Text>
          <Text fw={600} size="sm">87%</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Last deploy</Text>
          <Text fw={600} size="sm">3h ago</Text>
        </Paper>
      </Stack>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="xs">How-to</Text>
        <Text size="sm" c="dimmed" mb="sm">
          Scroll to ## Commands and format <code>npm run build</code> as inline code.
        </Text>

        <ScrollArea h={200} offsetScrollbars>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </ScrollArea>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleSave}>Save how-to</Button>
        </Group>
      </Card>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
}
