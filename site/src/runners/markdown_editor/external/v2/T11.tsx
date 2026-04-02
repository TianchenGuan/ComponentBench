'use client';

/**
 * T11: Staging changelog offscreen owner replacement
 *
 * Nested scroll panel with two fixed-height editors: "Production changelog" and
 * "Staging changelog". Both have internal scrollbars. The target line `Backend: TBD`
 * in Staging changelog sits below the fold under `### Owners`.
 * Task: Change `Backend: TBD` → `Backend: Integrations` in Staging only.
 * Success: Staging matches target, Production unchanged, "Apply staging note" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INIT_PRODUCTION = `# Changelog

## Summary
Production rollout is complete.

### Owners
Frontend: Release
Backend: Platform

## Status
- Monitoring`;

const INIT_STAGING = `# Changelog

## Summary
Staging rollout is planned.

## Changes
- Refactored auth middleware for token rotation
- Added circuit breaker to payment gateway
- Updated cache invalidation strategy for /api/v2
- Fixed race condition in session manager
- Migrated logging pipeline to structured JSON
- Enabled feature flag for dark-mode onboarding

## Dependencies
- redis 7.2 → 7.4
- express 4.18 → 4.21
- pg-pool 3.6 → 3.7

### Owners
Frontend: Release
Backend: TBD

## Status
- Waiting on sign-off`;

const TARGET_STAGING = `# Changelog

## Summary
Staging rollout is planned.

## Changes
- Refactored auth middleware for token rotation
- Added circuit breaker to payment gateway
- Updated cache invalidation strategy for /api/v2
- Fixed race condition in session manager
- Migrated logging pipeline to structured JSON
- Enabled feature flag for dark-mode onboarding

## Dependencies
- redis 7.2 → 7.4
- express 4.18 → 4.21
- pg-pool 3.6 → 3.7

### Owners
Frontend: Release
Backend: Integrations

## Status
- Waiting on sign-off`;

export default function T11({ onSuccess }: TaskComponentProps) {
  const [production, setProduction] = useState(INIT_PRODUCTION);
  const [staging, setStaging] = useState(INIT_STAGING);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      markdownMatches(staging, TARGET_STAGING) &&
      markdownMatches(production, INIT_PRODUCTION)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, staging, production, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 20, width: 900 }}>
      <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ padding: '4px 10px', background: '#f6ffed', borderRadius: 12, fontSize: 12, color: '#52c41a' }}>
          Production: stable
        </span>
        <span style={{ padding: '4px 10px', background: '#fff7e6', borderRadius: 12, fontSize: 12, color: '#fa8c16' }}>
          Staging: pending
        </span>
      </div>

      <div
        style={{
          flex: 1,
          maxHeight: 520,
          overflow: 'auto',
          padding: 16,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Production changelog</div>
          <MDEditor
            value={production}
            onChange={(val) => setProduction(val || '')}
            preview="edit"
            height={200}
            data-color-mode="light"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Staging changelog</div>
          <MDEditor
            value={staging}
            onChange={(val) => { setSaved(false); setStaging(val || ''); }}
            preview="edit"
            height={200}
            data-color-mode="light"
          />
        </div>
        <button
          onClick={() => setSaved(true)}
          style={{
            padding: '8px 20px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Apply staging note
        </button>
      </div>
    </div>
  );
}
