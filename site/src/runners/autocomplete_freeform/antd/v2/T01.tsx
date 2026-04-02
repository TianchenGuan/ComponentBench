'use client';

/**
 * autocomplete_freeform-antd-v2-T01: Drawer labels — add one suggested tag and one custom tag
 *
 * Drawer flow with two tag-mode Select fields (Incident labels, Archive labels).
 * Keep existing `backend`, add suggested `urgent`, add custom `sev-zero`.
 * Click "Apply labels" to commit. Archive labels must remain {legacy}.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, Drawer, Select, Space, Statistic, Typography, Row, Col, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const incidentSuggestions = ['urgent', 'customer-visible', 'infra', 'backend'];
const archiveSuggestions = ['legacy', 'deprecated', 'archived'];

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [incidentTags, setIncidentTags] = useState<string[]>(['backend']);
  const [archiveTags, setArchiveTags] = useState<string[]>(['legacy']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleApply = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (
      arraysEqual(incidentTags, ['backend', 'urgent', 'sev-zero']) &&
      arraysEqual(archiveTags, ['legacy'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, incidentTags, archiveTags, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="Release Triage Dashboard" style={{ maxWidth: 700 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}><Statistic title="Open incidents" value={14} /></Col>
          <Col span={8}><Statistic title="P0 active" value={3} valueStyle={{ color: '#cf1322' }} /></Col>
          <Col span={8}><Statistic title="Resolved today" value={7} /></Col>
        </Row>

        <Text type="secondary">Recent: INC-1042 cache miss, INC-1041 timeout spike</Text>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>Edit labels</Button>
        </div>
      </Card>

      <Drawer
        title="Edit labels"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply labels</Button>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Incident labels</Text>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add labels"
              value={incidentTags}
              onChange={setIncidentTags}
              autoClearSearchValue={false}
              options={incidentSuggestions.map(s => ({ label: s, value: s }))}
              data-testid="incident-labels"
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Archive labels</Text>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add labels"
              value={archiveTags}
              onChange={setArchiveTags}
              options={archiveSuggestions.map(s => ({ label: s, value: s }))}
              data-testid="archive-labels"
            />
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
