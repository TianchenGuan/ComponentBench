'use client';

/**
 * rich_text_editor-mantine-T17: Remove all formatting but keep the text
 *
 * Form_section layout with a couple of read-only fields (Title, Category) above the editor as low clutter.
 * The RichTextEditor labeled "Summary" contains one sentence: "Beta is available now."
 * The word "Beta" is bold and "available" is italic in the initial state.
 * The toolbar includes a ClearFormatting control (eraser icon) which clears marks from the current selection.
 *
 * Success: Plain text equals exactly "Beta is available now."
 * No bold/italic/underline/strike/highlight/code marks remain anywhere in the sentence.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, TextInput, Stack } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const TARGET_TEXT = 'Beta is available now.';

export default function T17({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link, Highlight, Underline],
    content: '<p><strong>Beta</strong> is <em>available</em> now.</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      
      if (!textsMatch(plainText, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        return;
      }

      const html = editor.getHTML();
      
      // Check no formatting marks remain
      const hasFormatting = /<(strong|b|em|i|u|s|strike|del|mark|code)>/i.test(html);
      const hasLink = /<a\s/i.test(html);
      
      if (!hasFormatting && !hasLink) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="form-section">
      <Text fw={600} size="lg" mb="md">
        Article Details
      </Text>
      
      <Stack gap="md" mb="lg">
        <TextInput
          label="Title"
          value="Product Update"
          disabled
        />
        <TextInput
          label="Category"
          value="Announcements"
          disabled
        />
      </Stack>
      
      <Text fw={500} mb="xs">Summary</Text>
      <Text size="sm" c="dimmed" mb="sm">
        Clear formatting (keep the words).
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content data-testid="summary-editor" />
      </RichTextEditor>
    </Card>
  );
}
