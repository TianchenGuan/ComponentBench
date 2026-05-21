'use client';

/**
 * toggle_button_group_multi-antd-T09: Scroll to advanced widgets and select
 *
 * Layout: settings_panel centered in the viewport.
 *
 * The page is a long "Dashboard settings" panel with a sticky left sidebar (non-interactive 
 * in this task) and a scrollable main content area. The main content contains multiple 
 * sections stacked vertically.
 *
 * Two toggle-button multi-select groups (same canonical type) exist:
 * 1) "Overview widgets" (near the top, visible on load)
 *    - Options: Logs, Metrics, Traces, Alerts, Audit
 *    - Initial state: Logs and Metrics selected
 * 2) "Advanced widgets" (below the fold; requires scrolling to reach)
 *    - Options: Logs, Metrics, Traces, Alerts, Audit
 *    - Initial state: Traces selected only
 *
 * The toggle groups are implemented as AntD checkbox groups styled as small buttons. 
 * Each section has its own heading and helper text.
 *
 * Distractors / clutter (medium):
 * - Several unrelated switches (e.g., "Show grid", "Enable animations") between sections.
 * - A read-only "Preview" thumbnail near the bottom.
 *
 * No Apply/Save step; selections apply immediately. The task targets ONLY the 
 * "Advanced widgets" instance.
 *
 * Success: Advanced widgets → Metrics, Alerts, Audit (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Switch, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text, Paragraph } = Typography;

const WIDGET_OPTIONS = ['Logs', 'Metrics', 'Traces', 'Alerts', 'Audit'];
const TARGET_SET = new Set(['Metrics', 'Alerts', 'Audit']);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [overviewWidgets, setOverviewWidgets] = useState<string[]>(['Logs', 'Metrics']);
  const [advancedWidgets, setAdvancedWidgets] = useState<string[]>(['Traces']);
  const [showGrid, setShowGrid] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const successFiredRef = useRef(false);

  // Initial states for non-target section
  const overviewInitial = useRef(['Logs', 'Metrics']);

  useEffect(() => {
    if (successFiredRef.current) return;

    const advancedSet = new Set(advancedWidgets);
    const advancedMatches = advancedSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => advancedSet.has(v));

    if (advancedMatches) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [advancedWidgets, onSuccess]);

  const renderWidgetGroup = (
    selected: string[], 
    setSelected: (v: string[]) => void, 
    sectionId: string
  ) => (
    <Checkbox.Group
      value={selected}
      onChange={(values) => setSelected(values as string[])}
      style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}
      data-testid={`${sectionId}-group`}
      data-section={sectionId}
    >
      {WIDGET_OPTIONS.map(widget => (
        <Checkbox
          key={widget}
          value={widget}
          style={{
            padding: '6px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            background: selected.includes(widget) ? '#1677ff' : '#fff',
            color: selected.includes(widget) ? '#fff' : '#333',
            fontSize: 13,
          }}
          data-testid={`${sectionId}-${widget.toLowerCase()}`}
        >
          {widget}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );

  return (
    <div style={{ display: 'flex', width: 800 }}>
      {/* Sidebar */}
      <div style={{ 
        width: 180, 
        background: '#fafafa', 
        borderRight: '1px solid #e8e8e8',
        padding: 16,
        position: 'sticky',
        top: 0,
        height: 'fit-content',
      }}>
        <Text strong>Settings</Text>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text style={{ color: '#666', fontSize: 13 }}>Display</Text>
          <Text style={{ color: '#666', fontSize: 13 }}>Widgets</Text>
          <Text style={{ color: '#666', fontSize: 13 }}>Advanced</Text>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1, 
        padding: 24, 
        maxHeight: 400, 
        overflowY: 'auto',
        background: '#fff',
      }} data-testid="settings-scroll-area">
        <Title level={4}>Dashboard settings</Title>
        
        {/* Overview widgets section */}
        <Card size="small" style={{ marginBottom: 16 }} data-testid="overview-widgets-section">
          <Title level={5}>Overview widgets</Title>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Select widgets to display in the overview section.
          </Paragraph>
          {renderWidgetGroup(overviewWidgets, setOverviewWidgets, 'Overview widgets')}
        </Card>

        <Divider />

        {/* Distractors */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Switch checked={showGrid} onChange={setShowGrid} size="small" />
            <Text>Show grid</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch checked={enableAnimations} onChange={setEnableAnimations} size="small" />
            <Text>Enable animations</Text>
          </div>
        </div>

        <Divider />

        {/* Some filler content to ensure scrolling is required */}
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Title level={5}>Layout options</Title>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Customize the layout of your dashboard panels.
          </Paragraph>
          <Text style={{ fontSize: 12, color: '#999' }}>No configurable options at this time.</Text>
        </Card>

        <Divider />

        {/* Advanced widgets section (TARGET) */}
        <Card size="small" style={{ marginBottom: 16 }} data-testid="advanced-widgets-section">
          <Title level={5}>Advanced widgets</Title>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Select widgets to display in the advanced section. 
            <br />
            <strong>Select: Metrics, Alerts, Audit</strong>
          </Paragraph>
          {renderWidgetGroup(advancedWidgets, setAdvancedWidgets, 'Advanced widgets')}
        </Card>

        {/* Preview thumbnail */}
        <Card size="small" style={{ background: '#f5f5f5' }}>
          <Title level={5}>Preview</Title>
          <div style={{ 
            width: '100%', 
            height: 80, 
            background: '#e8e8e8', 
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: 12,
          }}>
            Dashboard preview thumbnail
          </div>
        </Card>
      </div>
    </div>
  );
}
