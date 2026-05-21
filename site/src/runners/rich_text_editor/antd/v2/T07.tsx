'use client';

/**
 * rich_text_editor-antd-v2-T07: Three-step carryover formatting with save
 *
 * Settings panel with one TipTap editor labeled "Reminder" containing
 * `Please review the Q1 plan today.` Toolbar has Highlight, Italic, and Inline Code.
 * "Apply reminder" commits. Three marks on three different substrings.
 *
 * Success: Text unchanged, Q1 highlighted, plan inline code, today italic. Apply clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Switch, Tag, Segmented, Divider } from 'antd';
import {
  ItalicOutlined,
  HighlightOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

const INITIAL_TEXT = 'Please review the Q1 plan today.';

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Highlight, CodeExtension],
    content: `<p>${INITIAL_TEXT}</p>`,
  });

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !editor) return;

    const plainText = editor.getText();
    if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    const html = editor.getHTML();

    // Check Q1 highlighted
    const highlightRegex = /<mark[^>]*>([^<]*)<\/mark>/g;
    const highlightMatches: string[] = [];
    let m;
    while ((m = highlightRegex.exec(html)) !== null) highlightMatches.push(m[1]);
    if (highlightMatches.length !== 1 || highlightMatches[0].trim() !== 'Q1') return;

    // Check plan as inline code
    const codeRegex = /<code>([^<]*)<\/code>/g;
    const codeMatches: string[] = [];
    while ((m = codeRegex.exec(html)) !== null) codeMatches.push(m[1]);
    if (codeMatches.length !== 1 || codeMatches[0].trim() !== 'plan') return;

    // Check today italic
    const italicRegex = /<em>([^<]*)<\/em>/g;
    const italicMatches: string[] = [];
    while ((m = italicRegex.exec(html)) !== null) italicMatches.push(m[1]);
    if (italicMatches.length !== 1 || italicMatches[0].trim() !== 'today') return;

    successFired.current = true;
    onSuccess();
  }, [saved, editor, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 24 }}>
      {/* Settings panel clutter */}
      <Card title="Preferences" size="small" style={{ width: 220 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>Notifications</Text><Switch defaultChecked size="small" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>Dark mode</Text><Switch size="small" /></div>
          <Divider style={{ margin: '8px 0' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>Region</Text>
          <Segmented options={['US', 'EU', 'AP']} size="small" />
          <Divider style={{ margin: '8px 0' }} />
          <Space><Tag color="green">Active</Tag><Tag>v2.1</Tag></Space>
        </Space>
      </Card>

      {/* Main editor card */}
      <Card title="Reminder" style={{ flex: 1 }} data-testid="reminder-card">
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Highlight "Q1", italicize "today", and format "plan" as inline code.
        </Text>

        <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <Space wrap style={{ padding: 8, borderBottom: '1px solid #d9d9d9' }}>
            <Button size="small" icon={<HighlightOutlined />} onClick={() => editor?.chain().focus().toggleHighlight().run()} type={editor?.isActive('highlight') ? 'primary' : 'default'} />
            <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
            <Button size="small" icon={<CodeOutlined />} onClick={() => editor?.chain().focus().toggleCode().run()} type={editor?.isActive('code') ? 'primary' : 'default'} />
          </Space>
          <EditorContent editor={editor} />
        </div>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleApply}>Apply reminder</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 60px; padding: 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
        .ProseMirror mark { background: #ffe58f; padding: 1px 2px; }
        .ProseMirror code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
      `}</style>
    </div>
  );
}
