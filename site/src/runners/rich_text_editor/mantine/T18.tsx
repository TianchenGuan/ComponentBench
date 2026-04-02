'use client';

/**
 * rich_text_editor-mantine-T18: Match a quote card (visual guidance, compact)
 *
 * The card contains two columns with compact spacing:
 * - Left column: RichTextEditor labeled "Quote card", initially empty.
 * - Right column: a read-only "Example" preview showing the target appearance.
 * The Example shows a blockquote containing the text "Stay curious" on one line,
 * followed by a normal paragraph containing "— Ada".
 * Toolbar includes Blockquote and standard text tools. Compact spacing makes controls slightly denser.
 *
 * Success: The "Quote card" editor matches the Example: a blockquote with text "Stay curious",
 * followed by a paragraph with text "— Ada".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Grid, Box } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

export default function T18({ onSuccess }: TaskComponentProps) {
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
      
      // Should have exactly 2 blocks
      if (content.length !== 2) return;
      
      // Block 1: blockquote with "Stay curious"
      const block1 = content[0];
      if (block1.type !== 'blockquote') return;
      const block1Text = getBlockquoteText(block1);
      if (normalizeText(block1Text) !== 'Stay curious') return;
      
      // Block 2: paragraph with "— Ada"
      const block2 = content[1];
      if (block2.type !== 'paragraph') return;
      const block2Text = getTextFromBlock(block2);
      if (normalizeText(block2Text) !== '— Ada') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 600 }} data-testid="quote-card-container">
      <Text fw={600} size="md" mb="sm">
        Quote card
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Match the Example formatting shown.
      </Text>
      
      <Grid gutter="sm">
        <Grid.Col span={7}>
          <RichTextEditor editor={editor} styles={{ root: { fontSize: '0.875rem' } }}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="quote-card-editor" />
          </RichTextEditor>
        </Grid.Col>
        
        <Grid.Col span={5}>
          <Box
            p="sm"
            style={{
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 'var(--mantine-radius-md)',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
            data-testid="example-card"
          >
            <Text size="xs" fw={500} c="dimmed" mb="xs">Example</Text>
            <blockquote style={{ 
              margin: '0 0 8px 0', 
              paddingLeft: '12px', 
              borderLeft: '3px solid var(--mantine-color-gray-4)',
              fontStyle: 'italic'
            }}>
              Stay curious
            </blockquote>
            <p style={{ margin: 0 }}>— Ada</p>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content
    .map((node: any) => node.text || '')
    .join('');
}

function getBlockquoteText(blockquote: any): string {
  if (!blockquote.content) return '';
  return blockquote.content
    .flatMap((node: any) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.map((t: any) => t.text || '');
      }
      return node.text || '';
    })
    .join('');
}
