'use client';

/**
 * rich_text_editor-antd-v2-T01: Bubble menu carryover in the correct blurb editor
 *
 * Two same-size TipTap editors ("Public blurb" / "Incident blurb") inside an Ant Design Card
 * titled "Service blurbs". No fixed toolbar – selecting text reveals a BubbleMenu with Bold/Italic.
 * "Apply blurb" commits both drafts.
 *
 * Success: "Incident blurb" text stays `This is urgent today.` with only `urgent` bold and
 * `today` italic. "Public blurb" stays `Routine update only.` unchanged. Apply clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { BoldOutlined, ItalicOutlined } from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Editor } from '@tiptap/react';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

function SelectionToolbar({ editor }: { editor: Editor | null }) {
  const [hasSelection, setHasSelection] = useState(false);
  useEffect(() => {
    if (!editor) return;
    const update = () => { const { from, to } = editor.state.selection; setHasSelection(from !== to); };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => { editor.off('selectionUpdate', update); editor.off('transaction', update); };
  }, [editor]);
  if (!editor || !hasSelection) return null;
  return (
    <Space size={2} style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, padding: '2px 4px', marginBottom: 4 }}>
      <Button size="small" type={editor.isActive('bold') ? 'primary' : 'default'} icon={<BoldOutlined />} onClick={() => editor.chain().focus().toggleBold().run()} />
      <Button size="small" type={editor.isActive('italic') ? 'primary' : 'default'} icon={<ItalicOutlined />} onClick={() => editor.chain().focus().toggleItalic().run()} />
    </Space>
  );
}

const PUBLIC_TEXT = 'Routine update only.';
const INCIDENT_TEXT = 'This is urgent today.';

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const publicEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `<p>${PUBLIC_TEXT}</p>`,
  });

  const incidentEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `<p>${INCIDENT_TEXT}</p>`,
  });

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved || !publicEditor || !incidentEditor) return;

    const pubPlain = publicEditor.getText();
    if (!textsMatch(pubPlain, PUBLIC_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    const incPlain = incidentEditor.getText();
    if (!textsMatch(incPlain, INCIDENT_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    const html = incidentEditor.getHTML();
    const boldMatches = html.match(/<strong>[^<]+<\/strong>/g) || [];
    const italicMatches = html.match(/<em>[^<]+<\/em>/g) || [];
    if (
      boldMatches.length === 1 &&
      /^\s*urgent\s*$/.test(boldMatches[0].replace(/<\/?strong>/g, '')) &&
      italicMatches.length === 1 &&
      /^\s*today\s*$/.test(italicMatches[0].replace(/<\/?em>/g, ''))
    ) {
      const pubHtml = publicEditor.getHTML();
      if (!/<strong>/.test(pubHtml) && !/<em>/.test(pubHtml)) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [saved, publicEditor, incidentEditor, onSuccess]);

  return (
    <div style={{ padding: 24, maxWidth: 620 }}>
      <Card
        title="Service blurbs"
        style={{ filter: 'contrast(1.1)' }}
        data-testid="service-blurbs-card"
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Edit only "Incident blurb". Make <code>urgent</code> bold and <code>today</code> italic, then click "Apply blurb".
        </Text>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Public blurb */}
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Public blurb</Text>
            <SelectionToolbar editor={publicEditor} />
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <EditorContent editor={publicEditor} />
            </div>
          </div>

          {/* Incident blurb */}
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Incident blurb</Text>
            <SelectionToolbar editor={incidentEditor} />
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <EditorContent editor={incidentEditor} />
            </div>
          </div>
        </Space>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleApply}>Apply blurb</Button>
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
