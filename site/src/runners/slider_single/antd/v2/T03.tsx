'use client';

/**
 * slider_single-antd-v2-T03: Match recommendations gauge (±0.01 of 0.83)
 *
 * Cluttered dashboard: Recommendations similarity threshold vs Search similarity threshold.
 * Reference gauge ref-recommendations-similarity at 0.83. Rec starts 0.70; Search fixed initial.
 * Persistent "Current" line on Recommendations updates on change complete only.
 *
 * Success: Recommendations within ±0.01 of 0.83; Search unchanged; require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, Row, Slider, Space, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const SEARCH_INITIAL = 0.55;
const TARGET = 0.83;
const TOL = 0.01;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [recValue, setRecValue] = useState(0.7);
  const [recDisplay, setRecDisplay] = useState(0.7);
  const [searchValue, setSearchValue] = useState(SEARCH_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const okRec = Math.abs(recValue - TARGET) <= TOL;
    const okSearch = searchValue === SEARCH_INITIAL;
    if (okRec && okSearch) {
      successFired.current = true;
      onSuccess();
    }
  }, [recValue, searchValue, onSuccess]);

  return (
    <div style={{ padding: 12, maxWidth: 900 }}>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={8}>
          <Card size="small" title="KPI">
            <Text type="secondary">CTR 3.2%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="Spark">
            <div style={{ height: 40, background: 'linear-gradient(90deg,#e6f7ff,#91d5ff)' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Space wrap>
            <Tag>A</Tag>
            <Tag>B</Tag>
            <Tag color="purple">Cohort</Tag>
          </Space>
        </Col>
      </Row>
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} md={12}>
          <Card size="small" title="Recommendations" styles={{ body: { paddingTop: 8 } }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
              Recommendations similarity threshold
            </Text>
            <div
              data-testid="ref-recommendations-similarity"
              style={{
                marginBottom: 12,
                padding: '6px 8px',
                background: '#fafafa',
                borderRadius: 4,
                border: '1px solid #f0f0f0',
              }}
            >
              <Text style={{ fontSize: 11, color: '#888' }}>Reference</Text>
              <div
                style={{
                  marginTop: 4,
                  height: 8,
                  borderRadius: 4,
                  background: '#e8e8e8',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${TARGET * 100}%`,
                    top: -2,
                    width: 3,
                    height: 12,
                    background: '#1677ff',
                    borderRadius: 1,
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={recValue}
              onChange={setRecValue}
              onChangeComplete={setRecDisplay}
              data-testid="slider-recommendations-similarity"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Current: {recDisplay.toFixed(2)}
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="Search">
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
              Search similarity threshold
            </Text>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={searchValue}
              onChange={setSearchValue}
              data-testid="slider-search-similarity"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Current: {searchValue.toFixed(2)}
            </Text>
          </Card>
        </Col>
      </Row>
      <Title level={5} style={{ marginTop: 16 }}>
        Overview
      </Title>
      <Text type="secondary">
        Tune similarity against the reference gauge; sibling slider must stay untouched.
      </Text>
    </div>
  );
}
