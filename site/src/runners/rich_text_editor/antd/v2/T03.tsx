'use client';

/**
 * rich_text_editor-antd-v2-T03: Sticky-toolbar offscreen inline-code edit
 *
 * A long TipTap document inside a fixed-height panel with a sticky toolbar.
 * The "## Commands" section starts offscreen. User must scroll within the editor,
 * select "npm run build", apply inline code, then click "Save how-to".
 *
 * Success: Committed document matches the block structure with only
 * `npm run build` formatted as inline code. Save clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Statistic } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const { Text } = Typography;

const INITIAL_HTML = `
<h1>Runbook</h1>
<h2>Summary</h2>
<p>Prepare the release carefully.</p>
<p>Check the staging environment before proceeding.</p>
<p>Coordinate with the on-call team if needed.</p>
<h2>Prerequisites</h2>
<p>Verify all feature flags are set correctly.</p>
<p>Review the deployment checklist one more time.</p>
<p>Confirm that monitoring dashboards are green.</p>
<h2>Commands</h2>
<p>Run npm run build before deployment.</p>
<h2>Notes</h2>
<p>Escalate if staging fails.</p>
`.trim();

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CodeExtension],
    content: INITIAL_HTML,
  });

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !editor) return;

    const json = editor.getJSON();
    const content = json.content || [];

    const expected = [
      { type: 'heading', level: 1, text: 'Runbook' },
      { type: 'heading', level: 2, text: 'Summary' },
      { type: 'paragraph', text: 'Prepare the release carefully.' },
      { type: 'paragraph', text: 'Check the staging environment before proceeding.' },
      { type: 'paragraph', text: 'Coordinate with the on-call team if needed.' },
      { type: 'heading', level: 2, text: 'Prerequisites' },
      { type: 'paragraph', text: 'Verify all feature flags are set correctly.' },
      { type: 'paragraph', text: 'Review the deployment checklist one more time.' },
      { type: 'paragraph', text: 'Confirm that monitoring dashboards are green.' },
      { type: 'heading', level: 2, text: 'Commands' },
      { type: 'paragraph', text: 'Run npm run build before deployment.', codeSpan: 'npm run build' },
      { type: 'heading', level: 2, text: 'Notes' },
      { type: 'paragraph', text: 'Escalate if staging fails.' },
    ];

    if (content.length !== expected.length) return;

    for (let i = 0; i < expected.length; i++) {
      const block = content[i];
      const exp = expected[i];
      if (block.type !== exp.type) return;
      if (exp.type === 'heading' && block.attrs?.level !== exp.level) return;

      const blockText = normalizeText(getFullText(block));
      if (blockText !== exp.text) return;

      if (exp.codeSpan) {
        const codeNodes = getMarkedTexts(block, 'code');
        if (codeNodes.length !== 1 || normalizeText(codeNodes[0]) !== exp.codeSpan) return;
        const nonCodeText = getNonMarkedText(block, 'code');
        if (hasMarkInText(block, 'code', nonCodeText)) return;
      } else {
        if (hasAnyMark(block, 'code')) return;
      }
    }

    successFired.current = true;
    onSuccess();
  }, [saved, editor, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 24 }}>
      {/* Sidebar distractor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 160 }}>
        <Card size="small"><Statistic title="Build time" value="3m 12s" /></Card>
        <Card size="small"><Statistic title="Test coverage" value="87%" /></Card>
        <Card size="small"><Statistic title="Open issues" value={14} /></Card>
      </div>

      {/* Editor panel */}
      <Card
        title="How-to"
        style={{ flex: 1, background: '#1a1a2e', color: '#e0e0e0' }}
        styles={{ header: { color: '#e0e0e0', borderBottom: '1px solid #333' }, body: { padding: 0 } }}
        data-testid="howto-card"
      >
        <div style={{ position: 'relative' }}>
          {/* Sticky toolbar */}
          <Space
            wrap
            style={{
              padding: 8,
              borderBottom: '1px solid #333',
              background: '#1a1a2e',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <Button size="small" icon={<BoldOutlined />} onClick={() => editor?.chain().focus().toggleBold().run()} type={editor?.isActive('bold') ? 'primary' : 'default'} />
            <Button size="small" icon={<ItalicOutlined />} onClick={() => editor?.chain().focus().toggleItalic().run()} type={editor?.isActive('italic') ? 'primary' : 'default'} />
            <Button size="small" icon={<CodeOutlined />} onClick={() => editor?.chain().focus().toggleCode().run()} type={editor?.isActive('code') ? 'primary' : 'default'} />
            <Button size="small" icon={<UnorderedListOutlined />} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
            <Button size="small" icon={<OrderedListOutlined />} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
          </Space>

          {/* Scrollable editor region */}
          <div style={{ height: 200, overflow: 'auto' }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div style={{ padding: '12px 16px', textAlign: 'right', borderTop: '1px solid #333' }}>
          <Button type="primary" onClick={handleSave}>Save how-to</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 400px; padding: 12px 16px; outline: none; color: #e0e0e0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 4px 0; }
        .ProseMirror h1, .ProseMirror h2 { margin: 8px 0 4px; }
        .ProseMirror code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
      `}</style>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}

function getMarkedTexts(block: any, markType: string): string[] {
  if (!block.content) return [];
  return block.content
    .filter((n: any) => n.marks?.some((m: any) => m.type === markType))
    .map((n: any) => n.text || '');
}

function getNonMarkedText(block: any, markType: string): string {
  if (!block.content) return '';
  return block.content
    .filter((n: any) => !n.marks?.some((m: any) => m.type === markType))
    .map((n: any) => n.text || '')
    .join('');
}

function hasMarkInText(_block: any, _markType: string, _text: string): boolean {
  return false;
}

function hasAnyMark(block: any, markType: string): boolean {
  if (!block.content) return false;
  return block.content.some((n: any) => n.marks?.some((m: any) => m.type === markType));
}
