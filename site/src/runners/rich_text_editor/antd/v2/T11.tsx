'use client';

/**
 * rich_text_editor-antd-v2-T11: Subscript and superscript in the correct note
 *
 * A review card with two side-by-side TipTap editors: "Meeting note" and "Chemistry note".
 * Chemistry note contains `H2O uses m2 notation.` The `2` in `H2O` must be subscript,
 * the `2` in `m2` must be superscript. Meeting note unchanged.
 *
 * Success: Chemistry note text unchanged with correct sub/superscript. Apply clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Row, Col } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

const CHEM_TEXT = 'H2O uses m2 notation.';
const MEETING_TEXT = 'Agenda locked.';

export default function T11({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const meetingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Subscript, Superscript],
    content: `<p>${MEETING_TEXT}</p>`,
  });

  const chemEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Subscript, Superscript],
    content: `<p>${CHEM_TEXT}</p>`,
  });

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !meetingEditor || !chemEditor) return;

    // Meeting note unchanged
    const meetText = meetingEditor.getText();
    if (!textsMatch(meetText, MEETING_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    // Chemistry note text unchanged
    const chemText = chemEditor.getText();
    if (!textsMatch(chemText, CHEM_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    // Check subscript and superscript via HTML
    const html = chemEditor.getHTML();

    const subMatches = html.match(/<sub>([^<]*)<\/sub>/g) || [];
    const supMatches = html.match(/<sup>([^<]*)<\/sup>/g) || [];

    if (subMatches.length !== 1 || supMatches.length !== 1) return;

    // The `2` in H2O should be subscript → appears as H<sub>2</sub>O
    if (!html.includes('H<sub>2</sub>O')) return;

    // The `2` in m2 should be superscript → appears as m<sup>2</sup>
    if (!html.includes('m<sup>2</sup>')) return;

    successFired.current = true;
    onSuccess();
  }, [saved, meetingEditor, chemEditor, onSuccess]);

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <Card title="Review notes" data-testid="review-card">
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Edit only "Chemistry note": subscript the 2 in H2O, superscript the 2 in m2.
        </Text>

        <Row gutter={16}>
          {/* Meeting note */}
          <Col span={12}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Meeting note</Text>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Space wrap style={{ padding: 4, borderBottom: '1px solid #d9d9d9' }}>
                <Button size="small" icon={<BoldOutlined />} onClick={() => meetingEditor?.chain().focus().toggleBold().run()} />
                <Button size="small" icon={<ItalicOutlined />} onClick={() => meetingEditor?.chain().focus().toggleItalic().run()} />
                <Button size="small" onClick={() => meetingEditor?.chain().focus().toggleSubscript().run()}>Sub</Button>
                <Button size="small" onClick={() => meetingEditor?.chain().focus().toggleSuperscript().run()}>Sup</Button>
              </Space>
              <EditorContent editor={meetingEditor} />
            </div>
          </Col>

          {/* Chemistry note */}
          <Col span={12}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Chemistry note</Text>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Space wrap style={{ padding: 4, borderBottom: '1px solid #d9d9d9' }}>
                <Button size="small" icon={<BoldOutlined />} onClick={() => chemEditor?.chain().focus().toggleBold().run()} />
                <Button size="small" icon={<ItalicOutlined />} onClick={() => chemEditor?.chain().focus().toggleItalic().run()} />
                <Button size="small" onClick={() => chemEditor?.chain().focus().toggleSubscript().run()} type={chemEditor?.isActive('subscript') ? 'primary' : 'default'}>Sub</Button>
                <Button size="small" onClick={() => chemEditor?.chain().focus().toggleSuperscript().run()} type={chemEditor?.isActive('superscript') ? 'primary' : 'default'}>Sup</Button>
              </Space>
              <EditorContent editor={chemEditor} />
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleApply}>Apply note</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 48px; padding: 8px 12px; outline: none; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
      `}</style>
    </div>
  );
}
