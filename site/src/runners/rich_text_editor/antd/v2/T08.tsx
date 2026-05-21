'use client';

/**
 * rich_text_editor-antd-v2-T08: Clear formatting in the correct editor among four
 *
 * High-contrast settings panel with four stacked TipTap editors in a Card
 * titled "Partner communications": Public summary, Partner summary, Rollback note,
 * Internal escalation. Only Partner summary should have formatting cleared.
 *
 * Success: Partner summary text stays `Beta is available now.` with no marks.
 * Other three editors unchanged. "Save panel" clicked.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const { Text } = Typography;

interface EditorInstance {
  label: string;
  initialContent: string;
  expectedText: string;
}

const EDITORS: EditorInstance[] = [
  { label: 'Public summary', initialContent: '<p>No breaking changes.</p>', expectedText: 'No breaking changes.' },
  { label: 'Partner summary', initialContent: '<p><strong>Beta</strong> is <em>available</em> now.</p>', expectedText: 'Beta is available now.' },
  { label: 'Rollback note', initialContent: '<p>Draft the rollback memo.</p>', expectedText: 'Draft the rollback memo.' },
  { label: 'Internal escalation', initialContent: '<p>Notify the on-call manager.</p>', expectedText: 'Notify the on-call manager.' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const publicEditor = useEditor({ immediatelyRender: false, extensions: [StarterKit], content: EDITORS[0].initialContent });
  const partnerEditor = useEditor({ immediatelyRender: false, extensions: [StarterKit], content: EDITORS[1].initialContent });
  const rollbackEditor = useEditor({ immediatelyRender: false, extensions: [StarterKit], content: EDITORS[2].initialContent });
  const internalEditor = useEditor({ immediatelyRender: false, extensions: [StarterKit], content: EDITORS[3].initialContent });

  const allEditors = [publicEditor, partnerEditor, rollbackEditor, internalEditor];

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (allEditors.some(e => !e)) return;

    for (let i = 0; i < EDITORS.length; i++) {
      const ed = allEditors[i]!;
      const text = ed.getText();
      if (!textsMatch(text, EDITORS[i].expectedText, { normalize: true, ignoreTrailingNewline: true })) return;
    }

    // Partner summary must have no formatting marks
    const partnerHtml = partnerEditor!.getHTML();
    const stripped = partnerHtml.replace(/<\/?p>/g, '');
    if (/<strong>|<em>|<u>|<s>|<mark|<code>|<a /.test(stripped)) return;

    // Other editors should be unchanged in text
    // (they had no formatting initially except Partner summary, so just text check suffices)

    successFired.current = true;
    onSuccess();
  }, [saved, ...allEditors, onSuccess]);

  return (
    <div style={{ padding: 24, background: '#000', minHeight: '100vh' }}>
      <Card
        title="Partner communications"
        style={{ maxWidth: 600, background: '#111', borderColor: '#555', filter: 'contrast(1.15)' }}
        styles={{ header: { color: '#fff', borderBottom: '1px solid #555' } }}
        data-testid="partner-comms-card"
      >
        <Text style={{ color: '#ccc', display: 'block', marginBottom: 16 }}>
          Clear all formatting in "Partner summary" only, then click "Save panel".
        </Text>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {EDITORS.map((def, idx) => {
            const ed = allEditors[idx];
            return (
              <div key={def.label}>
                <Text strong style={{ color: '#e0e0e0', display: 'block', marginBottom: 4 }}>{def.label}</Text>
                <div style={{ border: '1px solid #555', borderRadius: 4 }}>
                  <Space wrap style={{ padding: 4, borderBottom: '1px solid #555' }}>
                    <Button size="small" icon={<BoldOutlined />} onClick={() => ed?.chain().focus().toggleBold().run()} />
                    <Button size="small" icon={<ItalicOutlined />} onClick={() => ed?.chain().focus().toggleItalic().run()} />
                    <Button size="small" icon={<ClearOutlined />} onClick={() => ed?.chain().focus().selectAll().unsetAllMarks().run()} />
                  </Space>
                  <EditorContent editor={ed} />
                </div>
              </div>
            );
          })}
        </Space>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleSave}>Save panel</Button>
        </div>
      </Card>

      <style>{`
        .ProseMirror { min-height: 36px; padding: 6px 10px; outline: none; color: #e0e0e0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p { margin: 0; }
      `}</style>
    </div>
  );
}
