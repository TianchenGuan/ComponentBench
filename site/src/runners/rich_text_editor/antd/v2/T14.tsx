'use client';

/**
 * rich_text_editor-antd-v2-T14: Two-editor drawer with exact heading-divider-list structure
 *
 * "Open checklist drawer" opens an Ant Design Drawer with two TipTap editors:
 * "Deployment note" (target, starts empty) and "Internal note" (starts with "Leave untouched.").
 * Build an H3 "Risks", horizontal rule, bullet list ["API drift", "Manual rollback"] in
 * Deployment note. Click "Save drawer".
 *
 * Success: Deployment note has correct structure. Internal note unchanged. Drawer closed.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Drawer, Typography, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText, textsMatch } from '../../types';

const { Text } = Typography;

export default function T14({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const deployEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Leave untouched.</p>',
  });

  const handleSave = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !deployEditor || !internalEditor) return;
    if (drawerOpen) return;

    // Internal note unchanged
    if (!textsMatch(internalEditor.getText(), 'Leave untouched.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Deployment note structure
    const json = deployEditor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 3) return;

    // Block 0: H3 "Risks"
    if (content[0].type !== 'heading' || content[0].attrs?.level !== 3) return;
    if (normalizeText(getFullText(content[0])) !== 'Risks') return;

    // Block 1: horizontal rule
    if (content[1].type !== 'horizontalRule') return;

    // Block 2: bullet list with "API drift" and "Manual rollback"
    if (content[2].type !== 'bulletList') return;
    const items = content[2].content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'API drift') return;
    if (normalizeText(getListItemText(items[1])) !== 'Manual rollback') return;

    successFired.current = true;
    onSuccess();
  }, [saved, deployEditor, internalEditor, drawerOpen, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>Open checklist drawer</Button>
      <Text type="secondary" style={{ marginLeft: 12 }}>Edit the deployment note inside the drawer.</Text>

      <Drawer
        title="Checklist drawer"
        placement="right"
        width={560}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save drawer</Button>
            </Space>
          </div>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Deployment note */}
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Deployment note</Text>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
                <Button size="small" onClick={() => deployEditor?.chain().focus().toggleHeading({ level: 3 }).run()} type={deployEditor?.isActive('heading', { level: 3 }) ? 'primary' : 'default'}>H3</Button>
                <Button size="small" icon={<MinusOutlined />} onClick={() => deployEditor?.chain().focus().setHorizontalRule().run()}>HR</Button>
                <Button size="small" icon={<UnorderedListOutlined />} onClick={() => deployEditor?.chain().focus().toggleBulletList().run()} type={deployEditor?.isActive('bulletList') ? 'primary' : 'default'} />
                <Button size="small" icon={<BoldOutlined />} onClick={() => deployEditor?.chain().focus().toggleBold().run()} />
                <Button size="small" icon={<ItalicOutlined />} onClick={() => deployEditor?.chain().focus().toggleItalic().run()} />
              </Space>
              <EditorContent editor={deployEditor} />
            </div>
          </div>

          {/* Internal note */}
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Internal note</Text>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
                <Button size="small" icon={<BoldOutlined />} onClick={() => internalEditor?.chain().focus().toggleBold().run()} />
                <Button size="small" icon={<ItalicOutlined />} onClick={() => internalEditor?.chain().focus().toggleItalic().run()} />
              </Space>
              <EditorContent editor={internalEditor} />
            </div>
          </div>
        </Space>
      </Drawer>

      <style>{`
        .ProseMirror { min-height: 80px; padding: 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 4px 0; }
        .ProseMirror h3 { margin: 0 0 4px; }
        .ProseMirror ul { margin: 4px 0; padding-left: 1.25rem; }
        .ProseMirror hr { border: none; border-top: 1px solid #d9d9d9; margin: 8px 0; }
      `}</style>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}

function getListItemText(item: any): string {
  if (!item.content) return '';
  return item.content
    .flatMap((node: any) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.map((t: any) => t.text || '');
      }
      return node.text || '';
    })
    .join('');
}
