'use client';

/**
 * rich_text_editor-antd-v2-T02: Floating-menu rollback snippet
 *
 * An Ant Design Card titled "Release snippet" with a TipTap editor that starts empty.
 * A FloatingMenu appears on empty lines with Heading and Bullet List controls.
 * "Save snippet" commits the result.
 *
 * Success: Committed document has an H3 "Rollback" followed by a bullet list
 * with "Stop traffic" and "Restore backup" in that order. Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Statistic, Tag, Timeline } from 'antd';
import { FontSizeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const { Text } = Typography;

const TARGET_ITEMS = ['Stop traffic', 'Restore backup'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !editor) return;

    const json = editor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 2) return;

    const heading = content[0];
    if (heading.type !== 'heading' || heading.attrs?.level !== 3) return;
    if (normalizeText(getTextFromBlock(heading)) !== 'Rollback') return;

    const bulletList = content[1];
    if (bulletList.type !== 'bulletList') return;
    const items = bulletList.content || [];
    if (items.length !== TARGET_ITEMS.length) return;

    for (let i = 0; i < TARGET_ITEMS.length; i++) {
      const item = items[i];
      if (item.type !== 'listItem') return;
      if (normalizeText(getListItemText(item)) !== TARGET_ITEMS[i]) return;
    }

    successFired.current = true;
    onSuccess();
  }, [saved, editor, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 24 }}>
      {/* Distractor metric tiles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 140 }}>
        <Card size="small"><Statistic title="Uptime" value="99.2%" /></Card>
        <Card size="small"><Statistic title="Deploys" value={42} /></Card>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>Timeline</Text>
          <Timeline style={{ marginTop: 8 }} items={[{ children: 'Build started' }, { children: 'Tests passed' }, { children: 'Deployed' }]} />
        </Card>
      </div>

      {/* Main editor card */}
      <Card title="Release snippet" style={{ flex: 1 }} data-testid="release-snippet-card">
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Use the empty-line quick insert menu to create an H3 "Rollback" and a bullet list.
        </Text>

        <Space size={4} style={{ marginBottom: 8 }}>
          <Button
            size="small"
            icon={<FontSizeOutlined />}
            type={editor?.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            type={editor?.isActive('bulletList') ? 'primary' : 'default'}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </Button>
        </Space>
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <EditorContent editor={editor} />
        </div>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleSave}>Save snippet</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 120px; padding: 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
        .ProseMirror h3 { margin: 0 0 4px 0; }
        .ProseMirror ul { margin: 4px 0; padding-left: 1.25rem; }
      `}</style>
    </div>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
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
