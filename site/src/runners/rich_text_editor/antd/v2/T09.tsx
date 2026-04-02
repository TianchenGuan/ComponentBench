'use client';

/**
 * rich_text_editor-antd-v2-T09: Publish after mixed block-plus-inline formatting
 *
 * "Edit post" opens an Ant Design Modal with TipTap editor labeled "Post body".
 * Initial content: two plain paragraphs: "Launch" and "Run npm install before release."
 * Format "Launch" as centered H2, format only "npm install" as inline code.
 * Click "Publish" then "Confirm publish" (nested confirmation).
 *
 * Success: Committed post has centered H2 "Launch" + paragraph with inline code "npm install".
 * Both overlays closed.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Modal, Typography, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  AlignCenterOutlined,
  AlignLeftOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [published, setPublished] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CodeExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p>Launch</p><p>Run npm install before release.</p>',
  });

  const handlePublish = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setPublished(true);
    setConfirmOpen(false);
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !published || !editor) return;
    if (modalOpen || confirmOpen) return;

    const json = editor.getJSON();
    const content = json.content || [];
    if (content.length !== 2) return;

    // Block 0: centered H2 "Launch"
    const h = content[0];
    if (h.type !== 'heading' || h.attrs?.level !== 2) return;
    if (h.attrs?.textAlign !== 'center') return;
    if (normalizeText(getFullText(h)) !== 'Launch') return;

    // Block 1: paragraph with "npm install" as code
    const p = content[1];
    if (p.type !== 'paragraph') return;
    if (normalizeText(getFullText(p)) !== 'Run npm install before release.') return;

    const codeNodes = (p.content || []).filter((n: any) => n.marks?.some((m: any) => m.type === 'code'));
    if (codeNodes.length !== 1 || (codeNodes[0] as any).text !== 'npm install') return;

    const nonCodeNodes = (p.content || []).filter((n: any) => !n.marks?.some((m: any) => m.type === 'code'));
    if (nonCodeNodes.some((n: any) => n.marks?.some((m: any) => m.type === 'code'))) return;

    successFired.current = true;
    onSuccess();
  }, [published, editor, modalOpen, confirmOpen, onSuccess]);

  return (
    <div style={{ padding: 24, background: '#141414', minHeight: '100vh' }}>
      <Button type="primary" onClick={() => setModalOpen(true)}>Edit post</Button>
      <Text style={{ color: '#aaa', marginLeft: 12 }}>Open the editor to format and publish your post.</Text>

      <Modal
        title="Post body"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={600}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handlePublish}>Publish</Button>
          </Space>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Format "Launch" as centered H2 and "npm install" as inline code.
        </Text>

        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
            <Button size="small" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} type={editor?.isActive('heading', { level: 2 }) ? 'primary' : 'default'}>H2</Button>
            <Button size="small" icon={<BoldOutlined />} onClick={() => editor?.chain().focus().toggleBold().run()} type={editor?.isActive('bold') ? 'primary' : 'default'} />
            <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
            <Button size="small" icon={<CodeOutlined />} onClick={() => editor?.chain().focus().toggleCode().run()} type={editor?.isActive('code') ? 'primary' : 'default'} />
            <Button size="small" icon={<AlignCenterOutlined />} onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
            <Button size="small" icon={<AlignLeftOutlined />} onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
          </Space>
          <EditorContent editor={editor} />
        </div>
      </Modal>

      <Modal
        title="Confirm publish"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setConfirmOpen(false)}>Back</Button>
            <Button type="primary" onClick={handleConfirm}>Confirm publish</Button>
          </Space>
        }
      >
        <Text>Are you sure you want to publish this post?</Text>
      </Modal>

      <style>{`
        .ProseMirror { min-height: 100px; padding: 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 4px 0; }
        .ProseMirror h2 { margin: 0 0 4px; }
        .ProseMirror code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
      `}</style>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
