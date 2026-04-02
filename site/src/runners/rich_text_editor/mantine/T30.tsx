'use client';

/**
 * rich_text_editor-mantine-T30: Type a chemical formula with subscript (mixed guidance)
 *
 * Centered isolated card with two elements:
 * - A RichTextEditor labeled "Chem note", initially empty.
 * - A small read-only Example preview showing the desired output: "H₂O".
 * The toolbar includes Subscript control (requires the Subscript extension; it is enabled in this task).
 * The main challenge is applying subscript to only the digit "2" while keeping "H" and "O" normal.
 *
 * Success: The editor plain text is "H2O".
 * Only the character "2" is marked as subscript.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Grid, Box } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

export default function T30({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link, Subscript, Superscript],
    content: '',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      
      // Check plain text is "H2O"
      if (normalizeText(plainText) !== 'H2O') return;
      
      // Check that "2" is subscript
      const html = editor.getHTML();
      const subRegex = /<sub>([^<]*)<\/sub>/g;
      const subMatches: string[] = [];
      let match;
      while ((match = subRegex.exec(html)) !== null) {
        subMatches.push(match[1]);
      }
      
      // Should have exactly one subscript containing "2"
      if (subMatches.length === 1 && subMatches[0] === '2') {
        // Verify H and O are not subscript
        const fullHtml = editor.getHTML();
        // Make sure H and O are outside of sub tags
        if (!/<sub>[^<]*H[^<]*<\/sub>/.test(fullHtml) && !/<sub>[^<]*O[^<]*<\/sub>/.test(fullHtml)) {
          successFired.current = true;
          onSuccess();
        }
      }
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }} data-testid="rte-chem-note">
      <Text fw={600} size="lg" mb="md">
        Chem note
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Enter H₂O (2 as subscript).
      </Text>
      
      <Grid>
        <Grid.Col span={8}>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="chem-note-editor" />
          </RichTextEditor>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Box
            p="md"
            style={{
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 'var(--mantine-radius-md)',
              backgroundColor: 'var(--mantine-color-gray-0)',
              textAlign: 'center',
            }}
            data-testid="example-preview"
          >
            <Text size="xs" fw={500} c="dimmed" mb="xs">Example</Text>
            <Text size="xl">H<sub>2</sub>O</Text>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
