'use client';

/**
 * rich_text_editor-antd-v2-T04: Exact-span link insertion in a drawer
 *
 * Clicking "Edit resources" opens an Ant Design Drawer with a TipTap editor
 * labeled "Resources" containing `See the release notes for details.`
 * The toolbar has a Link control that opens a popover for entering a URL.
 * Success: `release notes` linked to `https://example.com/notes`, drawer saved & closed.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Drawer, Typography, Space, Input, Popover } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

const INITIAL_TEXT = 'See the release notes for details.';
const TARGET_LINK_TEXT = 'release notes';
const TARGET_HREF = 'https://example.com/notes';

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TipTapLink.configure({ openOnClick: false }),
    ],
    content: `<p>${INITIAL_TEXT}</p>`,
  });

  const handleSaveLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setLinkPopoverOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleSaveResources = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !editor) return;

    const plainText = editor.getText();
    if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    const json = editor.getJSON();
    const content = json.content || [];
    if (content.length !== 1 || content[0].type !== 'paragraph') return;

    const nodes = content[0].content || [];
    const linkNodes = nodes.filter((n: any) =>
      n.marks?.some((m: any) => m.type === 'link')
    );

    if (linkNodes.length !== 1) return;
    const linkNode = linkNodes[0];
    if ((linkNode as any).text !== TARGET_LINK_TEXT) return;
    const linkMark = linkNode.marks?.find((m: any) => m.type === 'link');
    if (linkMark?.attrs?.href !== TARGET_HREF) return;

    if (drawerOpen) return;

    successFired.current = true;
    onSuccess();
  }, [saved, editor, drawerOpen, onSuccess]);

  const linkPopoverContent = (
    <Space direction="vertical" size="small" style={{ width: 260 }}>
      <Text strong>URL</Text>
      <Input
        placeholder="https://..."
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onPressEnter={handleSaveLink}
        data-testid="link-url-input"
      />
      <Button size="small" type="primary" onClick={handleSaveLink}>Save link</Button>
    </Space>
  );

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>Edit resources</Button>
      <Text type="secondary" style={{ marginLeft: 12 }}>Open the resources drawer to add a link.</Text>

      <Drawer
        title="Resources"
        placement="right"
        width={520}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSaveResources}>Save resources</Button>
            </Space>
          </div>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Resources</Text>

        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
            <Button size="small" icon={<BoldOutlined />} onClick={() => editor?.chain().focus().toggleBold().run()} type={editor?.isActive('bold') ? 'primary' : 'default'} />
            <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
            <Popover
              content={linkPopoverContent}
              title="Insert link"
              trigger="click"
              open={linkPopoverOpen}
              onOpenChange={setLinkPopoverOpen}
            >
              <Button size="small" icon={<LinkOutlined />} type={editor?.isActive('link') ? 'primary' : 'default'} />
            </Popover>
          </Space>
          <EditorContent editor={editor} />
        </div>
      </Drawer>

      <style>{`
        .ProseMirror { min-height: 80px; padding: 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
        .ProseMirror a { color: #1677ff; text-decoration: underline; }
      `}</style>
    </div>
  );
}
