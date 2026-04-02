'use client';

/**
 * dialog_modal-antd-T07: Scroll a long modal to find the close control
 *
 * Layout: isolated_card, but the modal is positioned near the BOTTOM-RIGHT of the viewport.
 * The page loads with an Ant Design Modal open.
 *
 * Modal configuration:
 * - Title: "Release notes"
 * - Body: a long, scrollable block of text (~3 screens tall). The modal body scrolls.
 * - Footer: hidden (footer=null).
 * - At the very end of the scrollable body content there is a single primary button labeled "Close preview".
 * - Header close icon (×) is present but should NOT be used.
 *
 * Initial state: modal open; scroll position is at the top.
 * Success: The 'Release notes' modal is closed via 'Close preview' button (close_reason='close_preview_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text, Title } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Modal starts open
  const [lastClose, setLastClose] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Release notes',
    };
  }, []);

  const handleClosePreview = () => {
    setOpen(false);
    setLastClose('close-preview');
    window.__cbModalState = {
      open: false,
      close_reason: 'close_preview_button',
      modal_instance: 'Release notes',
    };
    
    // Success when closed via Close preview button
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseIcon = () => {
    setOpen(false);
    setLastClose('header-x');
    window.__cbModalState = {
      open: false,
      close_reason: 'close_icon',
      modal_instance: 'Release notes',
    };
  };

  // Long content for scrolling
  const releaseNotes = [
    { version: '3.0.0', date: 'January 2025', notes: 'Major release with new UI framework, performance improvements, and breaking API changes. Migrated to React 19 with improved server components support. Added dark mode across all components.' },
    { version: '2.5.0', date: 'November 2024', notes: 'Added support for drag and drop file uploads, improved accessibility features, and enhanced keyboard navigation. Fixed numerous bugs reported by the community.' },
    { version: '2.4.0', date: 'September 2024', notes: 'New dashboard widgets, improved analytics, and better mobile responsiveness. Added support for custom themes and brand colors.' },
    { version: '2.3.0', date: 'July 2024', notes: 'Enhanced security features including two-factor authentication, improved session management, and audit logging. Performance optimizations for large datasets.' },
    { version: '2.2.0', date: 'May 2024', notes: 'New collaboration features, real-time editing, and improved notification system. Added support for multiple workspaces and team management.' },
    { version: '2.1.0', date: 'March 2024', notes: 'Bug fixes and stability improvements. Enhanced error handling and user feedback. Improved documentation and API examples.' },
    { version: '2.0.0', date: 'January 2024', notes: 'Major release with redesigned user interface, new component library, and improved developer experience. Breaking changes in API structure.' },
    { version: '1.9.0', date: 'November 2023', notes: 'Added internationalization support with 15 new languages. Improved date and number formatting. Enhanced accessibility compliance.' },
    { version: '1.8.0', date: 'September 2023', notes: 'New reporting features, export capabilities, and improved data visualization. Added support for custom chart types.' },
    { version: '1.7.0', date: 'July 2023', notes: 'Performance improvements and bug fixes. Reduced bundle size by 30%. Improved loading times for initial page render.' },
  ];

  return (
    <>
      <Card title="Updates" style={{ width: 400 }}>
        <Paragraph>
          View the latest release notes for recent updates.
        </Paragraph>
      </Card>

      {lastClose && (
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Last close: {lastClose}
        </Text>
      )}

      <Modal
        title="Release notes"
        open={open}
        onCancel={handleCloseIcon}
        footer={null}
        width={500}
        style={{ top: 'auto', right: 24, bottom: 24, position: 'fixed' }}
        styles={{ body: { maxHeight: 400, overflowY: 'auto' } }}
        data-testid="modal-release-notes"
      >
        <div style={{ paddingBottom: 16 }}>
          {releaseNotes.map((release) => (
            <div key={release.version} style={{ marginBottom: 24 }}>
              <Title level={5}>Version {release.version}</Title>
              <Text type="secondary">{release.date}</Text>
              <Paragraph style={{ marginTop: 8 }}>{release.notes}</Paragraph>
            </div>
          ))}
          
          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Button
              type="primary"
              onClick={handleClosePreview}
              data-testid="cb-close-preview"
            >
              Close preview
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
