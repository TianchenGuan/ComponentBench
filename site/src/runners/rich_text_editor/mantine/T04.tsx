'use client';

/**
 * rich_text_editor-mantine-T04: Convert title to Heading 2
 *
 * Centered isolated card with one RichTextEditor labeled "Release note".
 * The editor starts with two lines:
 * - "Release Notes"
 * - "Added search."
 * The toolbar includes heading controls H1–H4. Clicking H2 toggles the current block to an H2 heading.
 * Changes apply immediately without confirmation.
 *
 * Success: The document has exactly two blocks: an H2 heading with text "Release Notes",
 * followed by a paragraph with text "Added search."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>Release Notes</p><p>Added search.</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const content = json.content || [];
      
      // Should have exactly 2 blocks
      if (content.length !== 2) return;
      
      const firstBlock = content[0];
      const secondBlock = content[1];
      
      // First block: heading level 2 with text "Release Notes"
      if (firstBlock.type !== 'heading' || firstBlock.attrs?.level !== 2) return;
      const firstText = normalizeText(getTextFromBlock(firstBlock));
      if (firstText !== 'Release Notes') return;
      
      // Second block: paragraph with text "Added search."
      if (secondBlock.type !== 'paragraph') return;
      const secondText = normalizeText(getTextFromBlock(secondBlock));
      if (secondText !== 'Added search.') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-release-note">
      <Text fw={600} size="lg" mb="md">
        Release note
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Make "Release Notes" a Heading 2.
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content
    .map((node: any) => node.text || '')
    .join('');
}
