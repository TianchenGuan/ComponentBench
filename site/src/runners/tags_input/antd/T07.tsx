'use client';

/**
 * tags_input-antd-T07: Disambiguate two tag fields and edit only Primary
 *
 * The page is a small **settings panel** anchored in the top-left of the viewport.
 * It contains two Ant Design Select components in **tags** mode:
 *
 * - "Primary tags" (target)
 * - "Secondary tags" (distractor)
 *
 * Both fields look similar and are stacked vertically with minimal spacing (compact panel styling), but each has a clear label above it.
 *
 * Initial state:
 * - Primary tags: empty.
 * - Secondary tags: pre-filled with two chips ("legacy", "do-not-edit").
 *
 * Controls:
 * - Each Select allows free typing + Enter to create tags.
 * - Each chip has a remove icon; the clear-all control is disabled for this page to encourage per-chip edits.
 *
 * Distractors:
 * - A non-functional "Reset defaults" link appears under the two fields (not required for success).
 *
 * Success: The target Tags Input component (Primary tags) contains exactly these tags (order does not matter): core, billing, api.
 */

import React, { useRef, useEffect } from 'react';
import { Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [primaryTags, setPrimaryTags] = React.useState<string[]>([]);
  const [secondaryTags, setSecondaryTags] = React.useState<string[]>(['legacy', 'do-not-edit']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = primaryTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['core', 'billing', 'api'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also check that secondary tags remain unchanged
    const secondaryUnchanged = secondaryTags.length === 2 && 
      secondaryTags.includes('legacy') && 
      secondaryTags.includes('do-not-edit');
    
    if (isSuccess && secondaryUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [primaryTags, secondaryTags, onSuccess]);

  return (
    <div style={{ width: 300, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
      <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>Settings</Text>
      
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Primary tags</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add primary tags..."
          value={primaryTags}
          onChange={setPrimaryTags}
          data-testid="primary-tags-input"
          aria-label="Primary tags"
          open={false}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Secondary tags</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add secondary tags..."
          value={secondaryTags}
          onChange={setSecondaryTags}
          data-testid="secondary-tags-input"
          aria-label="Secondary tags"
          open={false}
        />
      </div>

      <Link type="secondary" style={{ fontSize: 12 }}>Reset defaults</Link>
    </div>
  );
}
