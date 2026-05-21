'use client';

/**
 * rich_text_editor-mantine-T21: Heading + alignment + inline code (sticky toolbar)
 *
 * Isolated centered card with one RichTextEditor labeled "How-to".
 * The editor is configured with a sticky toolbar that remains visible when the content area scrolls.
 * Initial content has two paragraphs:
 * 1) "Install"
 * 2) "Run npm install to add dependencies."
 * Toolbar includes H2, AlignCenter, and Code controls.
 * No confirmation step; formatting changes apply immediately.
 *
 * Success: Block 1 is a Heading level 2 with text "Install" and textAlign=center.
 * Block 2 is a paragraph containing the substring "npm install" marked as inline code; other text is unmarked.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Code from '@tiptap/extension-code';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

export default function T21({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Code,
    ],
    content: '<p>Install</p><p>Run npm install to add dependencies.</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const content = json.content || [];
      
      // Should have exactly 2 blocks
      if (content.length !== 2) return;
      
      // Block 1: H2 with "Install" and textAlign=center
      const block1 = content[0];
      if (block1.type !== 'heading' || block1.attrs?.level !== 2) return;
      if (block1.attrs?.textAlign !== 'center') return;
      if (normalizeText(getTextFromBlock(block1)) !== 'Install') return;
      
      // Block 2: paragraph with "npm install" as code
      const block2 = content[1];
      if (block2.type !== 'paragraph') return;
      
      const block2Text = normalizeText(getTextFromBlock(block2));
      if (block2Text !== 'Run npm install to add dependencies.') return;
      
      // Check that "npm install" has code mark
      const html = editor.getHTML();
      const codeRegex = /<code>([^<]*)<\/code>/g;
      const codeMatches: string[] = [];
      let match;
      while ((match = codeRegex.exec(html)) !== null) {
        codeMatches.push(match[1]);
      }
      
      if (codeMatches.length !== 1 || codeMatches[0] !== 'npm install') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-how-to">
      <Text fw={600} size="lg" mb="md">
        How-to
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Make "Install" = centered H2, and "npm install" = inline code.
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Code />
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
