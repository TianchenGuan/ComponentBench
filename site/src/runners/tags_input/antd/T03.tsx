'use client';

/**
 * tags_input-antd-T03: Clear all existing tags with the clear control
 *
 * The UI is a single centered card titled "Notification settings".
 * The card contains one Ant Design Select in **tags** mode labeled "Tags".
 *
 * Initial state:
 * - The Tags field starts with two existing tag chips: "finance" and "urgent".
 *
 * Component configuration and controls:
 * - `allowClear` is enabled, so a clear (×) control appears on hover/focus in the right side of the Select.
 * - Each tag chip also has a small remove icon, but the fastest path is using the clear control.
 * - Clearing removes all selected tags immediately (no confirmation dialog).
 *
 * Other on-card elements (non-blocking clutter): a disabled "Preview" button and a short help text paragraph.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): (empty).
 */

import React, { useRef, useEffect } from 'react';
import { Card, Select, Typography, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [tags, setTags] = React.useState<string[]>(['finance', 'urgent']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (tags.length === 0 && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [tags, onSuccess]);

  return (
    <Card title="Notification settings" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select tags..."
          value={tags}
          onChange={setTags}
          allowClear
          data-testid="tags-input"
          open={false}
        />
      </div>
      <Button disabled style={{ marginBottom: 12 }}>Preview</Button>
      <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
        Tags help categorize your notifications for easier filtering.
      </Paragraph>
    </Card>
  );
}
