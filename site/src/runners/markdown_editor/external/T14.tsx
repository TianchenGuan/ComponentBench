'use client';

/**
 * markdown_editor-external-T14: Edit a bio in a modal and save
 *
 * Layout: modal_flow — a profile page with a modal editor.
 * Background (clutter low): a "Profile" card shows the current bio as rendered markdown and an "Edit bio" button.
 * Target component: the Markdown editor inside the "Edit bio" modal dialog.
 * Modal behavior:
 *   - Clicking "Edit bio" opens a centered modal.
 *   - Modal contains a single Markdown editor labeled "Bio (Markdown)".
 *   - Footer buttons: "Cancel" and "Save changes".
 *   - Changes are NOT committed to the profile card until "Save changes" is clicked.
 * Editor configuration inside modal:
 *   - Standard toolbar; preview shown below the textarea.
 *   - No internal scrolling needed for short bios.
 * Initial state:
 *   - Current committed bio (shown on profile card): "(empty)".
 *   - Modal editor starts empty when opened.
 * Feedback:
 *   - On Save, modal closes and the profile card bio updates immediately.
 *   - No toast; the updated bio text is visibly rendered in the background card after closing.
 *
 * Success: The committed (saved) bio markdown value equals:
 *   Hi! I'm Sam.
 *   I like markdown.
 * AND the modal dialog is closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = `Hi! I'm Sam.
I like markdown.`;

export default function T14({ onSuccess }: TaskComponentProps) {
  const [committedBio, setCommittedBio] = useState<string>('');
  const [draftBio, setDraftBio] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    // Success when committed bio matches and modal is closed
    if (!modalOpen && markdownMatches(committedBio, TARGET_TEXT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedBio, modalOpen, onSuccess]);

  const openModal = () => {
    setDraftBio(committedBio);
    setModalOpen(true);
  };

  const handleSave = () => {
    setCommittedBio(draftBio);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div style={{ width: 500 }}>
      {/* Profile card */}
      <div
        style={{
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Profile</h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Bio</div>
          <div
            style={{
              padding: 12,
              background: '#fafafa',
              borderRadius: 4,
              minHeight: 60,
              whiteSpace: 'pre-wrap',
              fontSize: 14,
              color: committedBio ? '#333' : '#999',
            }}
          >
            {committedBio || '(empty)'}
          </div>
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
          data-testid="edit-bio-button"
        >
          Edit bio
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
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
              width: 500,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
            data-testid="bio-modal"
          >
            <div style={{ padding: 20, borderBottom: '1px solid #e8e8e8' }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Edit bio</h3>
            </div>
            <div style={{ padding: 20 }} data-testid="md-editor-bio">
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Bio (Markdown)</div>
              <MDEditor
                value={draftBio}
                onChange={(val) => setDraftBio(val || '')}
                preview="live"
                height={180}
                data-color-mode="light"
              />
            </div>
            <div
              style={{
                padding: 16,
                borderTop: '1px solid #e8e8e8',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  color: '#333',
                  border: '1px solid #d9d9d9',
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
                Save changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
