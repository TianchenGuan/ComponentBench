'use client';

/**
 * markdown_editor-external-T12: Turn three lines into a bullet list (two instances)
 *
 * Layout: isolated_card centered with two stacked editors.
 * Components (instances): two Markdown editors of the same type:
 *   - "Short answer" (top)
 *   - "Long answer" (bottom)  ← TARGET
 * Configuration:
 *   - Both editors have identical toolbars (List buttons, Bold/Italic, Preview toggle).
 *   - Each editor shows a small preview below itself.
 * Initial state:
 *   - Short answer contains: "Alpha / Beta / Gamma" (single line, with slashes).
 *   - Long answer contains three plain lines: Alpha, Beta, Gamma
 * Distractors: none besides the second editor instance.
 * Feedback: using the Unordered List toolbar control or manual markdown will update the preview.
 *
 * Success: Long answer editor markdown value, after normalization, matches one of:
 *   - Alpha\n- Beta\n- Gamma (with -)
 *   - Alpha\n* Beta\n* Gamma (with *)
 * AND Short answer remains unchanged.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatchesAny, markdownMatches } from '../types';

const SHORT_ANSWER_INITIAL = 'Alpha / Beta / Gamma';
const LONG_ANSWER_INITIAL = `Alpha
Beta
Gamma`;

const TARGET_VALUES = [
  `- Alpha
- Beta
- Gamma`,
  `* Alpha
* Beta
* Gamma`,
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [shortAnswer, setShortAnswer] = useState<string>(SHORT_ANSWER_INITIAL);
  const [longAnswer, setLongAnswer] = useState<string>(LONG_ANSWER_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    // Success: Long answer matches target AND Short answer remains unchanged
    if (
      markdownMatchesAny(longAnswer, TARGET_VALUES) &&
      markdownMatches(shortAnswer, SHORT_ANSWER_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [shortAnswer, longAnswer, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Convert to bullet list</h3>

      {/* Short answer (distractor) */}
      <div style={{ marginBottom: 20 }} data-testid="md-editor-short-answer">
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Short answer</h4>
        <MDEditor
          value={shortAnswer}
          onChange={(val) => setShortAnswer(val || '')}
          preview="live"
          height={120}
          data-color-mode="light"
        />
      </div>

      {/* Long answer (TARGET) */}
      <div data-testid="md-editor-long-answer">
        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Long answer</h4>
        <MDEditor
          value={longAnswer}
          onChange={(val) => setLongAnswer(val || '')}
          preview="live"
          height={180}
          data-color-mode="light"
        />
      </div>
    </div>
  );
}
