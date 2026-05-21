'use client';

/**
 * rich_text_editor-mantine-v2-T09: Publish after mixed block-plus-inline formatting
 *
 * Modal flow. Click "Edit post" to open a modal with editor "Post body" containing two paragraphs:
 * "Launch" and "Run npm install before release." Format "Launch" as centered H2,
 * format "npm install" as inline code. Click "Publish", then "Confirm publish".
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Modal, Group, Stack } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeExtension,
    ],
    content: '<p>Launch</p><p>Run npm install before release.</p>',
  });

  const handlePublish = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!editor || successFired.current) return;

    const json = editor.getJSON();
    const content = json.content || [];
    if (content.length !== 2) { setConfirmOpen(false); setModalOpen(false); return; }

    const block1 = content[0];
    if (block1.type !== 'heading' || block1.attrs?.level !== 2) { setConfirmOpen(false); setModalOpen(false); return; }
    if (block1.attrs?.textAlign !== 'center') { setConfirmOpen(false); setModalOpen(false); return; }
    if (normalizeText(getTextFromBlock(block1)) !== 'Launch') { setConfirmOpen(false); setModalOpen(false); return; }

    const block2 = content[1];
    if (block2.type !== 'paragraph') { setConfirmOpen(false); setModalOpen(false); return; }
    if (normalizeText(getTextFromBlock(block2)) !== 'Run npm install before release.') { setConfirmOpen(false); setModalOpen(false); return; }

    const html = editor.getHTML();
    const codeMatches = html.match(/<code>([^<]*)<\/code>/g) || [];
    if (codeMatches.length !== 1 || !/<code>npm install<\/code>/.test(html)) { setConfirmOpen(false); setModalOpen(false); return; }

    setConfirmOpen(false);
    setModalOpen(false);
    successFired.current = true;
    onSuccess();
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450, margin: '0 auto' }}>
        <Text fw={600} size="lg" mb="md">Blog post</Text>
        <Text size="sm" c="dimmed" mb="md">
          Open editor, format Launch as centered H2 and npm install as inline code, then Publish → Confirm.
        </Text>
        <Button onClick={() => setModalOpen(true)}>Edit post</Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit post"
        size="lg"
      >
        <Text fw={500} size="sm" mb="xs">Post body</Text>
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
          <RichTextEditor.Content style={{ minHeight: 120 }} />
        </RichTextEditor>

        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handlePublish}>Publish</Button>
        </Group>
      </Modal>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm publish"
        size="sm"
        centered
      >
        <Text size="sm" mb="md">Are you sure you want to publish this post?</Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => setConfirmOpen(false)}>Back</Button>
          <Button color="green" onClick={handleConfirm}>Confirm publish</Button>
        </Group>
      </Modal>
    </>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
}
