'use client';

/**
 * rich_text_editor-mantine-v2-T13: High-contrast visual quote match with sibling preservation
 *
 * High-contrast settings panel with three editors: Customer-facing quote, Internal quote, Legal blurb.
 * Example card shows: blockquote "Stay curious" + paragraph "— Ada".
 * Only edit Customer-facing quote to match. Click "Apply quotes".
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group, Stack, Badge, Paper } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch, normalizeText } from '../../types';

export default function T13({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const customerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Do not publish yet.</p>',
  });

  const legalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Awaiting approval.</p>',
  });

  const handleApply = () => {
    if (!customerEditor || !internalEditor || !legalEditor || successFired.current) return;

    // Check non-target editors
    if (!textsMatch(internalEditor.getText(), 'Do not publish yet.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(legalEditor.getText(), 'Awaiting approval.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Check customer editor structure: blockquote "Stay curious" + paragraph "— Ada"
    const json = customerEditor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 2) return;

    // Block 1: blockquote containing "Stay curious"
    const bq = content[0];
    if (bq.type !== 'blockquote') return;
    const bqText = getBlockquoteText(bq);
    if (normalizeText(bqText) !== 'Stay curious') return;

    // Block 2: paragraph "— Ada"
    const para = content[1];
    if (para.type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(para)) !== '— Ada' && normalizeText(getTextFromBlock(para)) !== '\u2014 Ada') return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, width: 750 }}>
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        style={{ width: 600, backgroundColor: '#1a1a2e', color: '#e0e0e0' }}
      >
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg" c="white">Quotes panel</Text>
          <Badge color="red" variant="filled">High contrast</Badge>
        </Group>
        <Text size="sm" c="gray.4" mb="sm">
          Edit only "Customer-facing quote" to match the Example. Leave others unchanged.
        </Text>

        <div style={{ display: 'flex', gap: 12 }}>
          <Stack gap="md" style={{ flex: 1 }}>
            {[
              { label: 'Customer-facing quote', editor: customerEditor },
              { label: 'Internal quote', editor: internalEditor },
              { label: 'Legal blurb', editor: legalEditor },
            ].map(({ label, editor: ed }) => (
              <div key={label}>
                <Text fw={500} size="sm" mb={4} c="gray.3">{label}</Text>
                <RichTextEditor editor={ed}>
                  <RichTextEditor.Toolbar sticky stickyOffset={0}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Blockquote />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>
                  <RichTextEditor.Content />
                </RichTextEditor>
              </div>
            ))}
          </Stack>

          <Paper
            p="md"
            withBorder
            style={{ width: 180, backgroundColor: '#2a2a4a', alignSelf: 'flex-start' }}
          >
            <Text size="sm" fw={500} c="gray.4" mb="sm">Example</Text>
            <blockquote style={{
              margin: '0 0 8px 0',
              paddingLeft: 12,
              borderLeft: '3px solid #666',
              color: '#ccc',
              fontSize: '0.9rem',
            }}>
              Stay curious
            </blockquote>
            <p style={{ margin: 0, color: '#ccc', fontSize: '0.9rem' }}>— Ada</p>
          </Paper>
        </div>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleApply}>Apply quotes</Button>
        </Group>
      </Card>
    </div>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
}

function getBlockquoteText(bq: any): string {
  if (!bq.content) return '';
  return bq.content
    .flatMap((node: any) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.map((t: any) => t.text || '');
      }
      return node.text || '';
    })
    .join('');
}
