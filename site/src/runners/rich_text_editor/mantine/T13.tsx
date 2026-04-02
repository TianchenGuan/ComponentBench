'use client';

/**
 * rich_text_editor-mantine-T13: Update an existing link URL
 *
 * Baseline isolated card with one RichTextEditor labeled "Docs blurb".
 * Initial content: "Read the docs to get started." where the word "docs" is already a hyperlink
 * to https://old.example.com/docs.
 * The toolbar has Link and Unlink controls.
 *
 * Success: Plain text remains "Read the docs to get started."
 * The substring "docs" is a link with href exactly "https://docs.example.com/start".
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Text, TextInput, Button, Group, Popover } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const SafeLink = TiptapLink.extend({
  renderHTML({ HTMLAttributes }) {
    const { href, ...rest } = HTMLAttributes;
    return ['a', { ...rest, 'data-href': href, style: 'color: var(--mantine-color-blue-6); text-decoration: underline; cursor: pointer;' }, 0];
  },
});

const INITIAL_TEXT = 'Read the docs to get started.';
const TARGET_HREF = 'https://docs.example.com/start';

export default function T13({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      SafeLink.configure({
        openOnClick: false,
        autolink: false,
      }),
    ],
    content: '<p>Read the <a href="https://old.example.com/docs">docs</a> to get started.</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      if (successFired.current) return;
      const plainText = editor.getText();
      if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

      const json = editor.getJSON();
      let found = false;
      const walk = (node: any) => {
        if (node.marks) {
          for (const mark of node.marks) {
            if (mark.type === 'link' && mark.attrs?.href === TARGET_HREF && node.text?.trim() === 'docs') {
              found = true;
            }
          }
        }
        if (node.content) node.content.forEach(walk);
      };
      walk(json);

      if (found) {
        successFired.current = true;
        onSuccess();
      }
    };

    editor.on('update', checkSuccess);
    editor.on('transaction', checkSuccess);
    const interval = setInterval(checkSuccess, 500);
    return () => {
      editor.off('update', checkSuccess);
      editor.off('transaction', checkSuccess);
      clearInterval(interval);
    };
  }, [editor, onSuccess]);

  const openLinkEditor = useCallback(() => {
    if (!editor) return;
    const currentHref = editor.getAttributes('link').href || '';
    setLinkUrl(currentHref);
    setPopoverOpen(true);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setPopoverOpen(false);

    setTimeout(() => {
      if (successFired.current) return;
      const plainText = editor.getText();
      if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;
      const json = editor.getJSON();
      let found = false;
      const walk = (node: any) => {
        if (node.marks) {
          for (const mark of node.marks) {
            if (mark.type === 'link' && mark.attrs?.href === TARGET_HREF && node.text?.trim() === 'docs') {
              found = true;
            }
          }
        }
        if (node.content) node.content.forEach(walk);
      };
      walk(json);
      if (found) {
        successFired.current = true;
        onSuccess();
      }
    }, 100);
  }, [editor, linkUrl, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-docs-blurb">
      <Text fw={600} size="lg" mb="md">Docs blurb</Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <Popover opened={popoverOpen} onClose={() => setPopoverOpen(false)} position="bottom" withArrow>
              <Popover.Target>
                <Button variant="default" size="compact-xs" onClick={openLinkEditor} data-testid="link-edit-button">
                  Edit link
                </Button>
              </Popover.Target>
              <Popover.Dropdown style={{ minWidth: 400 }}>
                <TextInput
                  label="URL"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  mb="sm"
                  data-testid="link-url-input"
                />
                <Group justify="flex-end">
                  <Button variant="subtle" size="xs" onClick={() => setPopoverOpen(false)}>Cancel</Button>
                  <Button size="xs" onClick={saveLink} data-testid="save-link-button">Save</Button>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}
