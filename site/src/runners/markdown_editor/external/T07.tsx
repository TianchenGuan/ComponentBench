'use client';

/**
 * markdown_editor-external-T07: Fill a description inside a form
 *
 * Layout: form_section centered — a realistic "Create item" form with multiple fields.
 * Fields shown (distractors):
 *   - Text input: "Title"
 *   - Dropdown: "Category"
 *   - Toggle: "Featured"
 * Target component: one Markdown editor labeled "Description".
 * Configuration:
 *   - Standard toolbar is visible.
 *   - No Save/Apply; the form has a separate "Submit" button, but it is NOT required for this task.
 * Initial state: Description editor contains a placeholder but is empty.
 * Feedback: preview updates live; inline helper text shows "Markdown supported".
 *
 * Success: Editor markdown value equals "Short description: batteries included." after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = 'Short description: batteries included.';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [featured, setFeatured] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TARGET_TEXT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

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
      <h2 style={{ margin: '0 0 20px 0', fontSize: 20 }}>Create item</h2>
      
      {/* Title field (distractor) */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            fontSize: 14,
          }}
        />
      </div>

      {/* Category dropdown (distractor) */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          <option value="general">General</option>
          <option value="tech">Technology</option>
          <option value="news">News</option>
        </select>
      </div>

      {/* Featured toggle (distractor) */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          id="featured-toggle"
        />
        <label htmlFor="featured-toggle">Featured</label>
      </div>

      {/* Description editor (TARGET) */}
      <div data-testid="md-editor-description">
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description</label>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Markdown supported</div>
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || '')}
          preview="live"
          height={200}
          textareaProps={{ placeholder: 'Enter description...' }}
          data-color-mode="light"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          style={{
            padding: '10px 20px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
