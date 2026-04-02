'use client';

/**
 * markdown_editor-external-T30: Format a public quote (two instances, compact dark)
 *
 * Layout: isolated_card centered.
 * Theme: dark; Spacing: compact.
 * Components (instances): two Markdown editors stacked:
 *   - "Public quote"   ← TARGET
 *   - "Internal note"
 * Configuration:
 *   - Toolbars include Quote and Italic controls (small icons in compact spacing).
 *   - Editors are in Live (split) mode so preview is visible while formatting.
 * Initial state:
 *   - Public quote contains two plain lines (not a blockquote):
 *       The only way out is through.
 *       — Robert Frost
 *   - Internal note contains: "Do not share before approval."
 * Goal intent: format the Public quote as a proper blockquote and italicize the attribution line, without modifying the Internal note.
 * Feedback: preview should show a quoted block with an italicized attribution.
 *
 * Success: Public quote editor markdown value equals the target AND Internal note remains unchanged.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches, normalizeMarkdown } from '../types';

const PUBLIC_QUOTE_INITIAL = `The only way out is through.
— Robert Frost`;

const INTERNAL_NOTE_INITIAL = 'Do not share before approval.';

const PUBLIC_QUOTE_TARGET = `> The only way out is through.
>
> *— Robert Frost*`;

function quoteMatchesFlexible(md: string): boolean {
  const n = normalizeMarkdown(md);
  const lines = n.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const hasBlockquote = lines.some(l => l.startsWith('>'));
  const hasQuoteText = />\s*The only way out is through\.?/i.test(n);
  const hasItalicAttrib = />\s*\*.*Robert Frost.*\*/.test(n) ||
                          />\s*_.*Robert Frost.*_/.test(n);
  return hasBlockquote && hasQuoteText && hasItalicAttrib;
}

function noteUnchanged(md: string): boolean {
  const n = normalizeMarkdown(md);
  return n === normalizeMarkdown(INTERNAL_NOTE_INITIAL) || n === 'Do not share before approval';
}

export default function T30({ onSuccess }: TaskComponentProps) {
  const [publicQuote, setPublicQuote] = useState<string>(PUBLIC_QUOTE_INITIAL);
  const [internalNote, setInternalNote] = useState<string>(INTERNAL_NOTE_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const quoteOk = markdownMatches(publicQuote, PUBLIC_QUOTE_TARGET) || quoteMatchesFlexible(publicQuote);
    const noteOk = noteUnchanged(internalNote);
    if (quoteOk && noteOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [publicQuote, internalNote, onSuccess]);

  return (
    <div
      style={{
        padding: 16,
        background: '#1f1f1f',
        borderRadius: 8,
        border: '1px solid #444',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        color: '#fff',
        lineHeight: 1.4,
      }}
      data-color-mode="dark"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Format the quote</h3>

      {/* Public quote editor (TARGET) */}
      <div style={{ marginBottom: 16 }} data-testid="md-editor-public-quote">
        <h4 style={{ margin: '0 0 6px 0', fontSize: 13, color: '#888' }}>Public quote</h4>
        <div data-color-mode="dark">
          <MDEditor
            value={publicQuote}
            onChange={(val) => setPublicQuote(val || '')}
            preview="live"
            height={150}
          />
        </div>
      </div>

      {/* Internal note editor */}
      <div data-testid="md-editor-internal-note">
        <h4 style={{ margin: '0 0 6px 0', fontSize: 13, color: '#888' }}>Internal note</h4>
        <div data-color-mode="dark">
          <MDEditor
            value={internalNote}
            onChange={(val) => setInternalNote(val || '')}
            preview="live"
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
