'use client';

/**
 * rich_text_editor-antd-v2-T16: Correct reply editor with list-plus-closing and send
 *
 * A support card with three stacked TipTap editors: "Customer reply" (target, empty),
 * "Internal note" ("Remember to tag billing."), "Legal note" ("Do not promise compensation yet.").
 * Build an ordered list ["Acknowledge issue", "Ship fix"] followed by italic "— Support team"
 * in Customer reply. Click "Send reply".
 *
 * Success: Customer reply has ordered list + italic closing. Other two unchanged. Send clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText, textsMatch } from '../../types';

const { Text } = Typography;

export default function T16({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const customerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Remember to tag billing.</p>',
  });

  const legalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Do not promise compensation yet.</p>',
  });

  const handleSend = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !customerEditor || !internalEditor || !legalEditor) return;

    // Check non-target editors unchanged
    if (!textsMatch(internalEditor.getText(), 'Remember to tag billing.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(legalEditor.getText(), 'Do not promise compensation yet.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Check Customer reply structure
    const json = customerEditor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 2) return;

    // Block 0: ordered list
    const ol = content[0];
    if (ol.type !== 'orderedList') return;
    const items = ol.content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'Acknowledge issue') return;
    if (normalizeText(getListItemText(items[1])) !== 'Ship fix') return;

    // Block 1: italic paragraph "— Support team"
    const para = content[1];
    if (para.type !== 'paragraph') return;
    const paraText = normalizeText(getFullText(para));
    if (paraText !== '— Support team' && paraText !== '\u2014 Support team') return;
    const allItalic = para.content?.every((n: any) => n.marks?.some((m: any) => m.type === 'italic'));
    if (!allItalic) return;

    successFired.current = true;
    onSuccess();
  }, [saved, customerEditor, internalEditor, legalEditor, onSuccess]);

  const editorDefs = [
    { label: 'Customer reply', editor: customerEditor, isTarget: true },
    { label: 'Internal note', editor: internalEditor, isTarget: false },
    { label: 'Legal note', editor: legalEditor, isTarget: false },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <Card title="Support ticket #1042" data-testid="support-card">
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Edit only "Customer reply": ordered list then italic closing. Click "Send reply".
        </Text>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {editorDefs.map(({ label, editor: ed }) => (
            <div key={label}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>{label}</Text>
              <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
                <Space wrap style={{ padding: 4, borderBottom: '1px solid #d9d9d9' }}>
                  <Button size="small" icon={<BoldOutlined />} onClick={() => ed?.chain().focus().toggleBold().run()} />
                  <Button size="small" icon={<ItalicOutlined />} onClick={() => ed?.chain().focus().toggleItalic().run()} type={ed?.isActive('italic') ? 'primary' : 'default'} />
                  <Button size="small" icon={<OrderedListOutlined />} onClick={() => ed?.chain().focus().toggleOrderedList().run()} type={ed?.isActive('orderedList') ? 'primary' : 'default'} />
                </Space>
                <EditorContent editor={ed} />
              </div>
            </div>
          ))}
        </Space>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleSend}>Send reply</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 48px; padding: 8px 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 4px 0; }
        .ProseMirror ol { margin: 4px 0; padding-left: 1.25rem; }
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
