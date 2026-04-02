'use client';

/**
 * rich_text_editor-mantine-T02: Clear the draft note
 *
 * Baseline isolated card centered on the page with one RichTextEditor labeled "Draft note".
 * The content area starts with a single paragraph containing: "Draft: TBD".
 * The toolbar includes standard controls and the cursor is not initially focused.
 * There is a subtle placeholder text ("Write something…") that appears only when the editor becomes empty.
 *
 * Success: The "Draft note" editor's plain text is empty (length 0) after trimming whitespace.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'Write something…' }),
    ],
    content: '<p>Draft: TBD</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText().trim();
      // Also handle zero-width characters
      const cleaned = plainText.replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (cleaned.length === 0) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-draft-note">
      <Text fw={600} size="lg" mb="md">
        Draft note
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Clear the editor so it contains no text.
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}
