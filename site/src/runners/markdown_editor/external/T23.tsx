'use client';

/**
 * markdown_editor-external-T23: Discard edits with Cancel in a modal (dark theme)
 *
 * Layout: modal_flow on a dark-themed page.
 * Background: an "Announcement" card renders the currently committed markdown and has an "Edit announcement" button.
 * Target component: Markdown editor inside the "Edit announcement" modal.
 * Modal behavior:
 *   - Opened via "Edit announcement".
 *   - Footer buttons: "Cancel" and "Save".
 *   - Only clicking "Save" commits changes; "Cancel" discards draft edits.
 * Editor configuration:
 *   - Standard toolbar; preview below.
 * Initial state:
 *   - Committed announcement markdown (shown on background card):
 *     # Announcement
 *     Public launch next week.
 *   - When the modal opens, the editor is prefilled with the same committed content.
 * Feedback:
 *   - On Cancel, modal closes and the background card remains unchanged.
 *   - A subtle inline message appears briefly: "Changes discarded."
 *
 * Success: The committed announcement markdown remains exactly the original value AND
 *          the modal dialog is closed AND the draft was changed at least once.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const ORIGINAL_CONTENT = `# Announcement
Public launch next week.`;

const REQUIRED_DRAFT_ADDITION = '\nThis line should NOT be saved.';

export default function T23({ onSuccess }: TaskComponentProps) {
  const [committedContent, setCommittedContent] = useState<string>(ORIGINAL_CONTENT);
  const [draftContent, setDraftContent] = useState<string>(ORIGINAL_CONTENT);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftWasChanged, setDraftWasChanged] = useState(false);
  const [showDiscardedMessage, setShowDiscardedMessage] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    // Success: committed content equals original AND modal is closed AND draft was changed at least once
    if (!modalOpen && draftWasChanged && markdownMatches(committedContent, ORIGINAL_CONTENT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedContent, modalOpen, draftWasChanged, onSuccess]);

  const openModal = () => {
    setDraftContent(committedContent);
    setModalOpen(true);
    setDraftWasChanged(false);
  };

  const handleDraftChange = (val: string) => {
    setDraftContent(val);
    if (val !== committedContent) {
      setDraftWasChanged(true);
    }
  };

  const handleSave = () => {
    setCommittedContent(draftContent);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setShowDiscardedMessage(true);
    setTimeout(() => setShowDiscardedMessage(false), 2000);
  };

  return (
    <div
      style={{
        width: 550,
        padding: 24,
        background: '#1f1f1f',
        borderRadius: 8,
        border: '1px solid #444',
        color: '#fff',
      }}
      data-color-mode="dark"
    >
      {/* Announcement card */}
      <div
        style={{
          padding: 20,
          background: '#2a2a2a',
          borderRadius: 8,
          border: '1px solid #444',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Announcement</h3>
        <div
          style={{
            padding: 16,
            background: '#333',
            borderRadius: 4,
            whiteSpace: 'pre-wrap',
            fontSize: 14,
            color: '#ddd',
            marginBottom: 16,
          }}
        >
          {committedContent}
        </div>
        <button
          onClick={openModal}
          style={{
            padding: '8px 16px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
          data-testid="edit-announcement-button"
        >
          Edit announcement
        </button>
        {showDiscardedMessage && (
          <span style={{ marginLeft: 12, color: '#faad14', fontSize: 13 }}>Changes discarded.</span>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 999,
            }}
          />
          {/* Modal dialog */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 520,
              background: '#2a2a2a',
              borderRadius: 8,
              border: '1px solid #444',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              zIndex: 1000,
            }}
            data-testid="announcement-modal"
          >
            <div style={{ padding: 20, borderBottom: '1px solid #444' }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#fff' }}>Edit announcement</h3>
            </div>
            <div style={{ padding: 20 }} data-testid="md-editor-announcement">
              <div data-color-mode="dark">
                <MDEditor
                  value={draftContent}
                  onChange={(val) => handleDraftChange(val || '')}
                  preview="live"
                  height={200}
                />
              </div>
            </div>
            <div
              style={{
                padding: 16,
                borderTop: '1px solid #444',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  background: '#333',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  background: '#1677ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
                data-testid="save-button"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
