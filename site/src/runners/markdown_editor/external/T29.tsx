'use client';

/**
 * markdown_editor-external-T29: Fix a nested agenda list in a cluttered form
 *
 * Layout: form_section with high clutter — a realistic event-creation form.
 * Distractor UI (not required):
 *   - Event name input
 *   - Date picker input
 *   - Location input
 *   - Right-side "Formatting tips" panel
 *   - Bottom sticky action bar with "Save draft" and "Publish" buttons (NOT required)
 * Target component: one Markdown editor labeled "Agenda (Markdown)".
 * Configuration:
 *   - Standard toolbar present; preview shown below the editor.
 *   - No Save/Apply for the editor; live value is checked.
 * Initial state: the editor is prefilled with an incorrectly formatted outline:
 *   Agenda
 *   Intro
 *   Demo
 *     Q&A
 * Required final formatting: a level-2 heading "Agenda", followed by an ordered list where item 2 ("Demo") has a nested bullet "Q&A".
 * Feedback: preview should show a heading, a numbered list, and an indented bullet under item 2.
 *
 * Success: Editor markdown value equals the target after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const INITIAL_CONTENT = `Agenda
Intro
Demo
  Q&A`;

const TARGET_CONTENT = `## Agenda
1. Intro
2. Demo
   - Q&A`;

export default function T29({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TARGET_CONTENT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 20, width: 900 }}>
      {/* Left: Main form */}
      <div
        style={{
          flex: 1,
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ margin: '0 0 20px 0', fontSize: 20 }}>Create Event</h2>
        
        {/* Event name (distractor) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Event name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>

        {/* Date (distractor) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>

        {/* Location (distractor) */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>

        {/* Agenda editor (TARGET) */}
        <div data-testid="md-editor-agenda-markdown">
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>Agenda (Markdown)</label>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || '')}
            preview="live"
            height={200}
            data-color-mode="light"
          />
        </div>

        {/* Action bar (distractor) */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid #e8e8e8',
            display: 'flex',
            gap: 8,
          }}
        >
          <button
            style={{
              padding: '8px 16px',
              background: '#fff',
              color: '#333',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Save draft
          </button>
          <button
            style={{
              padding: '8px 16px',
              background: '#1677ff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Right: Formatting tips (distractor) */}
      <div
        style={{
          width: 220,
          padding: 16,
          background: '#fafafa',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Formatting tips</h4>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: '#666' }}>
          <li style={{ marginBottom: 6 }}>Use ## for headings</li>
          <li style={{ marginBottom: 6 }}>Use 1. 2. 3. for numbered lists</li>
          <li style={{ marginBottom: 6 }}>Indent with 3 spaces for nested items</li>
          <li>Use - for bullet points</li>
        </ul>
      </div>
    </div>
  );
}
