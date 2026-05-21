'use client';

/**
 * rich_text_editor-antd-v2-T15: Below-the-fold signature update with exact bold second line
 *
 * A settings page with lots of form fields above the fold. Below the fold is a
 * TipTap editor labeled "Email signature". Initial content: "Best," and "Sam" (two paragraphs).
 * Replace with "Thanks," and bold "Alex". Click "Save signature".
 *
 * Success: Two paragraphs: plain "Thanks," and bold "Alex". Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Switch, Select, Input, Divider } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const { Text, Title } = Typography;

export default function T15({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Best,</p><p>Sam</p>',
  });

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !editor) return;

    const json = editor.getJSON();
    const content = json.content || [];

    const blocks = content.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (blocks.length !== 2) return;

    // First paragraph: "Thanks," with no bold
    const p1 = blocks[0];
    if (p1.type !== 'paragraph') return;
    if (normalizeText(getFullText(p1)) !== 'Thanks,') return;
    if (p1.content?.some((n: any) => n.marks?.some((m: any) => m.type === 'bold'))) return;

    // Second paragraph: "Alex" all bold
    const p2 = blocks[1];
    if (p2.type !== 'paragraph') return;
    if (normalizeText(getFullText(p2)) !== 'Alex') return;
    const allBold = p2.content?.every((n: any) => n.marks?.some((m: any) => m.type === 'bold'));
    if (!allBold) return;

    successFired.current = true;
    onSuccess();
  }, [saved, editor, onSuccess]);

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <Title level={4}>Settings</Title>

      {/* Above-the-fold clutter */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Email notifications</Text>
            <Switch defaultChecked size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Push notifications</Text>
            <Switch size="small" />
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Display name</Text>
            <Input value="Alex Johnson" disabled size="small" />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Time zone</Text>
            <Select defaultValue="utc" size="small" style={{ width: '100%' }} options={[{ value: 'utc', label: 'UTC' }, { value: 'est', label: 'EST' }, { value: 'pst', label: 'PST' }]} />
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Two-factor auth</Text>
            <Switch defaultChecked size="small" />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Language</Text>
            <Select defaultValue="en" size="small" style={{ width: '100%' }} options={[{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }]} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Compact mode</Text>
            <Switch size="small" />
          </div>
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Default project</Text>
            <Input value="Website Redesign" disabled size="small" />
          </div>
        </Space>
      </Card>

      {/* Signature editor (below the fold) */}
      <Card size="small" data-testid="signature-card">
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Email signature</Text>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Change to: "Thanks," on line 1 and bold "Alex" on line 2.
        </Text>

        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
            <Button size="small" icon={<BoldOutlined />} onClick={() => editor?.chain().focus().toggleBold().run()} type={editor?.isActive('bold') ? 'primary' : 'default'} />
            <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
            <Button size="small" icon={<UnderlineOutlined />} onClick={() => editor?.chain().focus().toggleStrike().run()} />
          </Space>
          <EditorContent editor={editor} />
        </div>

        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <Button type="primary" onClick={handleSave}>Save signature</Button>
        </div>
      </Card>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
