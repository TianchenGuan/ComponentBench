'use client';

/**
 * T01: Drawer note — offscreen owner edit and save
 *
 * Right-side AntD Drawer with a fixed-height scrollable "Release note (Markdown)" editor.
 * Background: release dashboard with status chips, activity list, and summary card.
 * The `## Risks` section's `Owner: TBD` line is offscreen due to the small editor height.
 * Success: Change `Owner: TBD` → `Owner: Platform`, click "Save note", drawer closes.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Drawer, Button, Tag, Card } from 'antd';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `# Release note

## Summary
API rollout is in progress. No blockers reported.

## Changelog
- Migrated auth service to new token format
- Updated rate limiter thresholds for /api/v2 endpoints
- Fixed edge case in session refresh logic
- Added retry logic for upstream gateway timeouts
- Deprecated legacy /api/v1/sync endpoint
- Bumped dependency: openssl 3.1.4 → 3.2.1

## Rollback plan
1. Revert auth token migration via feature flag
2. Restore rate limiter config from snapshot
3. Re-enable /api/v1/sync if clients still depend on it

## Risks
Owner: TBD
Migration window: 2 hours

## Next steps
- Verify staging
- Notify support`;

const TARGET = `# Release note

## Summary
API rollout is in progress. No blockers reported.

## Changelog
- Migrated auth service to new token format
- Updated rate limiter thresholds for /api/v2 endpoints
- Fixed edge case in session refresh logic
- Added retry logic for upstream gateway timeouts
- Deprecated legacy /api/v1/sync endpoint
- Bumped dependency: openssl 3.1.4 → 3.2.1

## Rollback plan
1. Revert auth token migration via feature flag
2. Restore rate limiter config from snapshot
3. Re-enable /api/v1/sync if clients still depend on it

## Risks
Owner: Platform
Migration window: 2 hours

## Next steps
- Verify staging
- Notify support`;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState(INITIAL);
  const [committed, setCommitted] = useState(INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!drawerOpen && markdownMatches(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, drawerOpen, onSuccess]);

  const handleSave = () => {
    setCommitted(draft);
    setDrawerOpen(false);
  };

  const handleOpen = () => {
    setDraft(committed);
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: 'flex', gap: 20, width: 900, padding: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag color="green">v2.4 — Deployed</Tag>
          <Tag color="orange">v2.5 — Staging</Tag>
          <Tag color="blue">v2.6 — Draft</Tag>
        </div>
        <Card size="small" title="Release summary">
          <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
            API rollout is in progress. No blockers reported. 6 changes in this release.
          </p>
        </Card>
        <Card size="small" title="Recent activity">
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#666' }}>
            <li>Config pushed to staging</li>
            <li>Smoke tests passed</li>
            <li>Rollback window updated</li>
          </ul>
        </Card>
        <Button type="primary" onClick={handleOpen}>Edit release note</Button>
      </div>

      <Drawer
        title="Edit release note"
        placement="right"
        width={520}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save note</Button>
          </div>
        }
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Release note (Markdown)
        </div>
        <MDEditor
          value={draft}
          onChange={(val) => setDraft(val || '')}
          preview="edit"
          height={220}
          data-color-mode="light"
        />
      </Drawer>
    </div>
  );
}
