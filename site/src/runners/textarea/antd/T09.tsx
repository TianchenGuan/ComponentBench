'use client';

/**
 * textarea-antd-T09: Release notes in a drawer, then apply
 *
 * A settings page shows a button "Edit release notes".
 * - Light theme, comfortable spacing, default scale.
 * - Clicking the button opens an Ant Design Drawer from the right (drawer_flow).
 * - Inside the drawer is one Input.TextArea labeled "Release notes", initially containing old text "(none)".
 * - Below the textarea are two buttons: "Cancel" and primary "Apply changes".
 * - The drawer also contains two non-required toggles ("Notify users", "Pin to top") as distractors.
 *
 * Success: Committed value equals exactly:
 *   Changes:
 *   1. Fixed login bug
 *   2. Improved loading time
 * (require_confirm=true, whitespace=exact)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Drawer, Input, Switch, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

const TARGET_VALUE = `Changes:
1. Fixed login bug
2. Improved loading time`;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draftValue, setDraftValue] = useState('(none)');
  const [committedValue, setCommittedValue] = useState('(none)');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalize = (s: string) =>
      s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
    if (normalize(committedValue) === normalize(TARGET_VALUE) && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpen = () => {
    setDraftValue(committedValue);
    setIsDrawerOpen(true);
  };

  const handleApply = () => {
    setCommittedValue(draftValue);
    setIsDrawerOpen(false);
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Card title="Settings" style={{ width: 400 }}>
        <Button type="primary" onClick={handleOpen} data-testid="btn-edit-release-notes">
          Edit release notes
        </Button>
      </Card>

      <Drawer
        title="Edit Release Notes"
        placement="right"
        width={400}
        onClose={handleCancel}
        open={isDrawerOpen}
        footer={
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleApply} data-testid="btn-apply-changes">
              Apply changes
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="release-notes" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Release notes
          </label>
          <TextArea
            id="release-notes"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            rows={6}
            data-testid="textarea-release-notes"
          />
        </div>

        {/* Distractor toggles */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch size="small" />
          <Text>Notify users</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch size="small" />
          <Text>Pin to top</Text>
        </div>
      </Drawer>
    </>
  );
}
