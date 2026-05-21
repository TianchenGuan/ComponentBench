'use client';

/**
 * rich_text_editor-antd-v2-T06: Reconstruct a visual reference card and save
 *
 * Dashboard panel with an empty TipTap editor labeled "Sprint brief" beside a
 * read-only Example card. The Example shows: centered H2 "Sprint 12", ordered
 * list ["Fix bugs", "Polish UI"], italic paragraph "Last updated: Feb 3".
 *
 * Success: Committed Sprint brief matches: centered H2 "Sprint 12", ordered list,
 * italic final paragraph. Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Statistic, Tag, Row, Col } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignCenterOutlined,
  AlignLeftOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });

  const checkRef = useRef(() => {});
  checkRef.current = () => {
    if (successFired.current || !saved || !editor) return;

    const json = editor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 3) return;

    // Block 0: centered H2 "Sprint 12"
    const h = content[0];
    if (h.type !== 'heading' || h.attrs?.level !== 2) return;
    if (h.attrs?.textAlign !== 'center') return;
    if (normalizeText(getFullText(h)) !== 'Sprint 12') return;

    // Block 1: ordered list with "Fix bugs", "Polish UI"
    const ol = content[1];
    if (ol.type !== 'orderedList') return;
    const items = ol.content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'Fix bugs') return;
    if (normalizeText(getListItemText(items[1])) !== 'Polish UI') return;

    // Block 2: italic paragraph "Last updated: Feb 3"
    const p = content[2];
    if (p.type !== 'paragraph') return;
    if (normalizeText(getFullText(p)) !== 'Last updated: Feb 3') return;
    const allItalic = p.content?.every((n: any) => n.marks?.some((m: any) => m.type === 'italic'));
    if (!allItalic) return;

    successFired.current = true;
    onSuccess();
  };

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => checkRef.current(), 0);
  }, []);

  useEffect(() => {
    if (!editor) return;
    const handler = () => checkRef.current();
    editor.on('update', handler);
    return () => { editor.off('update', handler); };
  }, [editor]);

  useEffect(() => {
    checkRef.current();
  }, [saved]);

  return (
    <div style={{ padding: 24 }}>
      {/* Dashboard clutter */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card size="small"><Statistic title="Velocity" value={42} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Open PRs" value={7} /></Card></Col>
        <Col span={6}><Card size="small"><Tag color="green">On track</Tag><br /><Text type="secondary">Sprint status</Text></Card></Col>
        <Col span={6}><Card size="small"><Tag color="blue">v2.4.1</Tag><br /><Text type="secondary">Current version</Text></Card></Col>
      </Row>

      <Row gutter={16}>
        {/* Editor card */}
        <Col span={14}>
          <Card title="Sprint brief" data-testid="sprint-brief-card">
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              Match the Example card on the right, then click "Save brief".
            </Text>

            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
                <Button size="small" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} type={editor?.isActive('heading', { level: 2 }) ? 'primary' : 'default'}>H2</Button>
                <Button size="small" icon={<BoldOutlined />} onClick={() => editor?.chain().focus().toggleBold().run()} type={editor?.isActive('bold') ? 'primary' : 'default'} />
                <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
                <Button size="small" icon={<OrderedListOutlined />} onClick={() => editor?.chain().focus().toggleOrderedList().run()} type={editor?.isActive('orderedList') ? 'primary' : 'default'} />
                <Button size="small" icon={<UnorderedListOutlined />} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
                <Button size="small" icon={<AlignCenterOutlined />} onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
                <Button size="small" icon={<AlignLeftOutlined />} onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
              </Space>
              <EditorContent editor={editor} />
            </div>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" onClick={handleSave}>Save brief</Button>
            </div>
          </Card>
        </Col>

        {/* Example card */}
        <Col span={10}>
          <Card
            size="small"
            style={{ background: '#fafafa', border: '1px solid #d9d9d9' }}
            data-testid="example-card"
          >
            <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>Example</Text>
            <h2 style={{ textAlign: 'center', margin: '0 0 8px' }}>Sprint 12</h2>
            <ol style={{ margin: '0 0 8px', paddingLeft: '1.25rem' }}>
              <li>Fix bugs</li>
              <li>Polish UI</li>
            </ol>
            <p style={{ fontStyle: 'italic', margin: 0 }}>Last updated: Feb 3</p>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ProseMirror { min-height: 120px; padding: 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 4px 0; }
        .ProseMirror h2 { margin: 0 0 4px; }
        .ProseMirror ol, .ProseMirror ul { margin: 4px 0; padding-left: 1.25rem; }
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
