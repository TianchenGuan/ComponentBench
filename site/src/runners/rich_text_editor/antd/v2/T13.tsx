'use client';

/**
 * rich_text_editor-antd-v2-T13: High-contrast visual quote match with sibling preservation
 *
 * Three stacked TipTap editors in a high-contrast panel: Customer-facing quote,
 * Internal quote, Legal blurb. A read-only Example shows a blockquote "Stay curious"
 * followed by a paragraph "— Ada". Only Customer-facing quote should be edited.
 *
 * Success: Customer-facing quote has blockquote "Stay curious" + paragraph "— Ada".
 * Other two editors unchanged. "Apply quotes" clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Row, Col } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText, textsMatch } from '../../types';

const { Text } = Typography;

export default function T13({ onSuccess }: TaskComponentProps) {
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
    content: '<p>Do not publish yet.</p>',
  });

  const legalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Awaiting approval.</p>',
  });

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !customerEditor || !internalEditor || !legalEditor) return;

    // Check Internal and Legal unchanged
    if (!textsMatch(internalEditor.getText(), 'Do not publish yet.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(legalEditor.getText(), 'Awaiting approval.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Check Customer-facing quote structure
    const json = customerEditor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 2) return;

    const bq = content[0];
    if (bq.type !== 'blockquote') return;
    const bqInner = bq.content || [];
    if (bqInner.length !== 1) return;
    if (normalizeText(getFullText(bqInner[0])) !== 'Stay curious') return;

    const para = content[1];
    if (para.type !== 'paragraph') return;
    const paraText = normalizeText(getFullText(para));
    if (paraText !== '— Ada' && paraText !== '\u2014 Ada') return;

    successFired.current = true;
    onSuccess();
  }, [saved, customerEditor, internalEditor, legalEditor, onSuccess]);

  const editorDefs = [
    { label: 'Customer-facing quote', editor: customerEditor },
    { label: 'Internal quote', editor: internalEditor },
    { label: 'Legal blurb', editor: legalEditor },
  ];

  return (
    <div style={{ padding: 24, background: '#000', minHeight: '100vh' }}>
      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="Quotes panel"
            style={{ background: '#111', borderColor: '#555', filter: 'contrast(1.15)' }}
            styles={{ header: { color: '#fff', borderBottom: '1px solid #555' } }}
            data-testid="quotes-panel"
          >
            <Text style={{ color: '#ccc', display: 'block', marginBottom: 16 }}>
              Edit only "Customer-facing quote" to match the Example. Then click "Apply quotes".
            </Text>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {editorDefs.map(({ label, editor: ed }) => (
                <div key={label}>
                  <Text strong style={{ color: '#e0e0e0', display: 'block', marginBottom: 4 }}>{label}</Text>
                  <div style={{ border: '1px solid #555', borderRadius: 4 }}>
                    <Space wrap style={{ padding: 4, borderBottom: '1px solid #555' }}>
                      <Button size="small" icon={<BoldOutlined />} onClick={() => ed?.chain().focus().toggleBold().run()} />
                      <Button size="small" icon={<ItalicOutlined />} onClick={() => ed?.chain().focus().toggleItalic().run()} />
                      <Button size="small" onClick={() => ed?.chain().focus().toggleBlockquote().run()} type={ed?.isActive('blockquote') ? 'primary' : 'default'}>Quote</Button>
                    </Space>
                    <EditorContent editor={ed} />
                  </div>
                </div>
              ))}
            </Space>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" onClick={handleApply}>Apply quotes</Button>
            </div>
          </Card>
        </Col>

        {/* Example card */}
        <Col span={8}>
          <Card
            size="small"
            style={{ background: '#1a1a1a', borderColor: '#555' }}
            data-testid="example-card"
          >
            <Text style={{ color: '#aaa', fontWeight: 600, display: 'block', marginBottom: 8 }}>Example</Text>
            <blockquote style={{ borderLeft: '3px solid #666', paddingLeft: 12, margin: '0 0 8px', color: '#e0e0e0' }}>
              Stay curious
            </blockquote>
            <p style={{ margin: 0, color: '#e0e0e0' }}>— Ada</p>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ProseMirror { min-height: 48px; padding: 8px 12px; outline: none; color: #e0e0e0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
        .ProseMirror blockquote { border-left: 3px solid #666; padding-left: 12px; margin: 4px 0; }
      `}</style>
    </div>
  );
}

function getFullText(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
