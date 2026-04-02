'use client';

/**
 * rich_text_editor-antd-v2-T10: Append an exact final block at the true end
 *
 * A long TipTap document in a fixed-height panel with a sticky toolbar labeled "Changelog".
 * The true end is offscreen. User must scroll to the end, append a paragraph
 * `Checksum: sha256-ready` with `sha256-ready` as inline code, then click "Save changelog".
 *
 * Success: Document preserves original prefix and ends with the new paragraph.
 * Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Statistic } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const { Text } = Typography;

const LONG_DOC = `
<h1>Changelog</h1>
<h2>v2.0.0</h2>
<p>Rewrote the core engine from scratch.</p>
<p>Migrated the database layer to PostgreSQL.</p>
<h2>v2.1.0</h2>
<p>Added caching support for read-heavy endpoints.</p>
<p>Fixed a race condition in the auth middleware.</p>
<h2>v2.2.0</h2>
<p>Introduced feature flags for gradual rollout.</p>
<p>Improved logging and added structured traces.</p>
<h2>v2.3.0</h2>
<p>Enabled CORS configuration per route.</p>
<p>Bumped dependencies to latest patch versions.</p>
<h2>v2.4.0</h2>
<p>Automated canary deployment pipeline.</p>
<p>Monitoring continues overnight.</p>
`.trim();

export default function T10({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);
  const originalPrefixRef = useRef('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CodeExtension],
    content: LONG_DOC,
    onCreate: ({ editor: ed }) => {
      originalPrefixRef.current = ed.getHTML();
    },
  });

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  const checkSuccess = useCallback(() => {
    if (successFired.current || !saved || !editor) return;

    const json = editor.getJSON();
    const content = json.content || [];
    if (content.length < 2) return;

    const lastBlock = content[content.length - 1];
    if (lastBlock.type !== 'paragraph') return;

    const lastText = normalizeText(getFullText(lastBlock));
    if (lastText !== 'Checksum: sha256-ready') return;

    const codeNodes = (lastBlock.content || []).filter((n: any) =>
      n.marks?.some((m: any) => m.type === 'code')
    );
    if (codeNodes.length !== 1 || normalizeText((codeNodes[0] as any).text) !== 'sha256-ready') return;

    const secondToLast = content[content.length - 2];
    if (secondToLast.type !== 'paragraph') return;
    if (normalizeText(getFullText(secondToLast)) !== 'Monitoring continues overnight.') return;

    successFired.current = true;
    onSuccess();
  }, [saved, editor, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => checkSuccess();
    editor.on('update', handler);
    return () => { editor.off('update', handler); };
  }, [editor, checkSuccess]);

  return (
    <div style={{ padding: 24, background: '#141414', minHeight: '100vh', display: 'flex', gap: 24 }}>
      {/* Sidebar metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 160 }}>
        <Card size="small" style={{ background: '#1f1f1f', borderColor: '#434343' }}>
          <Statistic title="Releases" value={12} valueStyle={{ color: '#e0e0e0' }} />
        </Card>
        <Card size="small" style={{ background: '#1f1f1f', borderColor: '#434343' }}>
          <Statistic title="Hotfixes" value={3} valueStyle={{ color: '#e0e0e0' }} />
        </Card>
      </div>

      {/* Editor */}
      <Card
        title="Changelog"
        style={{ flex: 1, background: '#1f1f1f', borderColor: '#434343' }}
        styles={{ header: { color: '#e0e0e0', borderBottom: '1px solid #434343' }, body: { padding: 0 } }}
        data-testid="changelog-card"
      >
        <div style={{ position: 'relative' }}>
          <Space
            wrap
            style={{
              padding: 8,
              borderBottom: '1px solid #434343',
              background: '#1f1f1f',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <Button size="small" icon={<BoldOutlined />} onClick={() => editor?.chain().focus().toggleBold().run()} type={editor?.isActive('bold') ? 'primary' : 'default'} />
            <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
            <Button size="small" icon={<CodeOutlined />} onClick={() => editor?.chain().focus().toggleCode().run()} type={editor?.isActive('code') ? 'primary' : 'default'} />
            <Button size="small" icon={<OrderedListOutlined />} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
            <Button size="small" icon={<UnorderedListOutlined />} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
          </Space>

          <div style={{ height: 220, overflow: 'auto' }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div style={{ padding: '12px 16px', textAlign: 'right', borderTop: '1px solid #434343' }}>
          <Button type="primary" onClick={handleSave}>Save changelog</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 500px; padding: 12px 16px; outline: none; color: #e0e0e0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 4px 0; }
        .ProseMirror h1, .ProseMirror h2 { margin: 12px 0 4px; color: #f0f0f0; }
        .ProseMirror code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
      `}</style>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
