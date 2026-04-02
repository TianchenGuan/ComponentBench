'use client';

/**
 * rich_text_editor-mantine-T22: Use bubble menu to bold selected word
 *
 * Centered isolated card with one RichTextEditor labeled "Inline edit".
 * The editor shows a minimal toolbar with Bold/Italic controls.
 * Initial content is one paragraph: "This is important for launch."
 * No confirmation step; state updates immediately.
 *
 * Success: Plain text remains "This is important for launch."
 * Only the substring "important" is bold.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_TEXT = 'This is important for launch.';

export default function T22({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: `<p>${INITIAL_TEXT}</p>`,
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      
      if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        return;
      }

      const html = editor.getHTML();
      
      // Check that "important" is bold
      const boldRegex = /<strong>([^<]*)<\/strong>|<b>([^<]*)<\/b>/g;
      const boldMatches: string[] = [];
      let match;
      while ((match = boldRegex.exec(html)) !== null) {
        boldMatches.push(match[1] || match[2]);
      }
      
      if (boldMatches.length === 1 && boldMatches[0] === 'important') {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-inline-edit">
      <Text fw={600} size="lg" mb="md">
        Inline edit
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Bold "important" (select the word and click Bold).
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold aria-label="Bold" />
            <RichTextEditor.Italic aria-label="Italic" />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}
