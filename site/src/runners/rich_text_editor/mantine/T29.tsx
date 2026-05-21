'use client';

/**
 * rich_text_editor-mantine-T29: Append text at the end of a long editor (bottom-right)
 *
 * The editor card is anchored near the bottom-right of the viewport (placement=bottom_right).
 * One RichTextEditor labeled "Changelog" contains a long multi-paragraph changelog
 * (enough to require scrolling inside the editor content area).
 * The toolbar is sticky to the top of the editor frame.
 * The task is to append a new final paragraph "End of notes." at the very end of the document
 * (after the last existing paragraph), not in the middle.
 * No Save button; changes apply immediately.
 *
 * Success: The "Changelog" editor ends with a final paragraph whose text is exactly "End of notes."
 * All existing content before the final paragraph remains unchanged.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

const INITIAL_CONTENT = `
<p><strong>v1.0.0</strong> - Initial release</p>
<p>Added basic functionality for user registration and login.</p>
<p><strong>v1.1.0</strong> - Bug fixes</p>
<p>Fixed issue with password reset emails not being sent.</p>
<p>Improved error handling in the API.</p>
<p><strong>v1.2.0</strong> - New features</p>
<p>Added dark mode support.</p>
<p>Implemented export functionality.</p>
<p><strong>v1.3.0</strong> - Performance improvements</p>
<p>Optimized database queries for faster loading.</p>
<p>Reduced bundle size by 30%.</p>
<p><strong>v1.4.0</strong> - UI overhaul</p>
<p>Redesigned dashboard with better analytics.</p>
<p>Added responsive design for mobile devices.</p>
`;

const TARGET_FINAL_TEXT = 'End of notes.';

export default function T29({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const initialBlockCount = useRef<number | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: INITIAL_CONTENT.trim(),
    onCreate: ({ editor }) => {
      const json = editor.getJSON();
      initialBlockCount.current = (json.content || []).length;
    },
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const content = json.content || [];
      
      if (content.length === 0) return;
      
      // Get last block
      const lastBlock = content[content.length - 1];
      if (lastBlock.type !== 'paragraph') return;
      
      const lastText = getTextFromBlock(lastBlock);
      if (normalizeText(lastText) !== TARGET_FINAL_TEXT) return;
      
      // Verify content length increased (appended, not replaced)
      if (initialBlockCount.current !== null && content.length <= initialBlockCount.current) return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }} data-testid="rte-changelog">
      <Text fw={600} size="lg" mb="md">
        Changelog
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Append: End of notes.
      </Text>
      <RichTextEditor editor={editor} styles={{ content: { maxHeight: 300, overflowY: 'auto' } }}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content data-testid="changelog-editor" />
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
