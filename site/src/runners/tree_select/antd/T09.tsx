'use client';

/**
 * tree_select-antd-T09: Scroll to find Z-Index bug tag
 *
 * Layout/placement: isolated_card anchored near the bottom-left of the viewport.
 * The component is rendered in the small size tier.
 * Target component: one AntD TreeSelect labeled "Issue tag"; initial value empty.
 * Dropdown behavior: the popup panel has a fixed max height and becomes scrollable.
 * Tree data (large; designed to require scrolling):
 *   - Bugs → UI (≈25 leaf tags), Backend (≈15 leaf tags), Performance (≈10 leaf tags)
 *   - Feature requests → UI, Backend
 * Configuration: search is disabled; user must expand and scroll.
 *
 * Success: Issue tag TreeSelect selection is exactly the leaf with canonical path [Bugs, UI, Z-Index].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect } from 'antd';
import type { TaskComponentProps } from '../types';

// Generate UI bug tags (alphabetical, Z-Index near bottom)
const uiBugTags = [
  'Alignment', 'Button', 'Color', 'Dropdown', 'Focus', 'Hover', 'Layout',
  'Modal', 'Popover', 'Scroll', 'Tooltip', 'Typography', 'Animation',
  'Border', 'Padding', 'Margin', 'Opacity', 'Shadow', 'Transform',
  'Transition', 'Visibility', 'Width', 'Height', 'Overflow', 'Z-Index',
].map((tag) => ({
  value: `tag_bugs_ui_${tag.toLowerCase().replace('-', '')}`,
  title: tag,
}));

const backendBugTags = [
  'API', 'Auth', 'Cache', 'Database', 'Error', 'Logging', 'Memory',
  'Network', 'Performance', 'Query', 'Rate Limit', 'Security', 'Session',
  'Timeout', 'Validation',
].map((tag) => ({
  value: `tag_bugs_backend_${tag.toLowerCase().replace(' ', '_')}`,
  title: tag,
}));

const perfBugTags = [
  'Bundle Size', 'CPU', 'Memory', 'Network', 'Render', 'Startup',
  'Database', 'Cache', 'Lazy Load', 'Code Split',
].map((tag) => ({
  value: `tag_bugs_perf_${tag.toLowerCase().replace(' ', '_')}`,
  title: tag,
}));

const treeData = [
  {
    value: 'bugs',
    title: 'Bugs',
    selectable: false,
    children: [
      {
        value: 'bugs_ui',
        title: 'UI',
        selectable: false,
        children: uiBugTags,
      },
      {
        value: 'bugs_backend',
        title: 'Backend',
        selectable: false,
        children: backendBugTags,
      },
      {
        value: 'bugs_performance',
        title: 'Performance',
        selectable: false,
        children: perfBugTags,
      },
    ],
  },
  {
    value: 'feature_requests',
    title: 'Feature requests',
    selectable: false,
    children: [
      { value: 'feat_ui', title: 'UI' },
      { value: 'feat_backend', title: 'Backend' },
    ],
  },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'tag_bugs_ui_zindex') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card
      title={<span style={{ fontSize: 14 }}>Issue tag</span>}
      style={{ width: 350 }}
      size="small"
      data-testid="tree-select-card"
    >
      <div style={{ marginBottom: 8 }}>
        <span style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>
          Issue title: Login button not responding
        </span>
      </div>
      <div>
        <label htmlFor="issue-tag" style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
          Issue tag
        </label>
        <TreeSelect
          id="issue-tag"
          data-testid="tree-select-issue-tag"
          style={{ width: '100%' }}
          size="small"
          value={value}
          onChange={(val) => setValue(val)}
          treeData={treeData}
          placeholder="Select a tag"
          showSearch={false}
          treeDefaultExpandAll={false}
          dropdownStyle={{ maxHeight: 240, overflow: 'auto' }}
          listHeight={200}
        />
      </div>
    </Card>
  );
}
