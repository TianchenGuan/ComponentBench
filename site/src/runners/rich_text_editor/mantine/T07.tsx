'use client';

/**
 * rich_text_editor-mantine-T07: Center-align a short announcement
 *
 * The only content is in a single isolated card anchored near the top-right of the viewport
 * (placement=top_right). The card contains one RichTextEditor labeled "Announcement" with
 * initial content: "All hands at 3 PM".
 * The toolbar includes alignment controls (AlignLeft/AlignCenter/AlignRight/AlignJustify).
 * Alignment applies to the current block. No other components are present.
 *
 * Success: The "Announcement" editor contains one paragraph with text "All hands at 3 PM".
 * That paragraph has text alignment set to center.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

const TARGET_TEXT = 'All hands at 3 PM';

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `<p>${TARGET_TEXT}</p>`,
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const content = json.content || [];
      
      // Should have exactly 1 paragraph
      if (content.length !== 1) return;
      
      const block = content[0];
      if (block.type !== 'paragraph') return;
      
      // Check text
      const text = getTextFromBlock(block);
      if (normalizeText(text) !== TARGET_TEXT) return;
      
      // Check alignment is center
      if (block.attrs?.textAlign !== 'center') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-testid="rte-announcement">
      <Text fw={600} size="lg" mb="md">
        Announcement
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Center-align the paragraph.
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignRight />
            <RichTextEditor.AlignJustify />
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
