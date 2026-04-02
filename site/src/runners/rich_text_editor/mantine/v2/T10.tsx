'use client';

/**
 * rich_text_editor-mantine-v2-T10: Append an exact final block at the true end
 *
 * Nested scroll layout. Editor "Changelog" in a fixed-height panel with sticky toolbar.
 * The document is long; the true end is offscreen. Append a final paragraph
 * "Checksum: sha256-ready" with `sha256-ready` as inline code. Click "Save changelog".
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const INITIAL_HTML = `<h1>Changelog v2.4</h1>
<h2>Features</h2>
<p>Added dark mode toggle in settings.</p>
<p>Introduced new API rate limiting.</p>
<p>Dashboard refresh interval is now configurable.</p>
<h2>Bug fixes</h2>
<p>Fixed login redirect on expired sessions.</p>
<p>Resolved timezone offset in reports.</p>
<p>Corrected CSV export column ordering.</p>
<h2>Infrastructure</h2>
<p>Migrated to containerized builds.</p>
<p>Updated TLS certificates for staging.</p>
<p>Monitoring continues overnight.</p>`;

export default function T10({ onSuccess }: TaskComponentProps) {
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

    // The last non-empty block should be the new checksum paragraph
    const nonEmpty = content.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );
    if (nonEmpty.length < 2) return;

    const lastBlock = nonEmpty[nonEmpty.length - 1];
    if (lastBlock.type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(lastBlock)) !== 'Checksum: sha256-ready') return;

    // Check that sha256-ready is inline code
    const html = editor.getHTML();
    if (!/<code>sha256-ready<\/code>/.test(html)) return;

    // Verify the original second-to-last block is the original ending
    const secondToLast = nonEmpty[nonEmpty.length - 2];
    if (normalizeText(getTextFromBlock(secondToLast)) !== 'Monitoring continues overnight.') return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, width: 800 }}>
      <Stack gap="sm" style={{ width: 170 }}>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Version</Text>
          <Text fw={700}>v2.4</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Release date</Text>
          <Text fw={500} size="sm">Feb 15, 2024</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">Changes</Text>
          <Text fw={700}>11 entries</Text>
        </Paper>
      </Stack>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="xs">Changelog</Text>
        <Text size="sm" c="dimmed" mb="sm">
          Scroll to end, append: Checksum: <code>sha256-ready</code>
        </Text>

        <ScrollArea h={200} offsetScrollbars>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
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
          <Button onClick={handleSave}>Save changelog</Button>
        </Group>
      </Card>
    </div>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
}
