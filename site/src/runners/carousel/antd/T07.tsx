'use client';

/**
 * carousel-antd-T07: Reports carousel: find and stop on 'Q4 Summary'
 *
 * The page is a form_section layout titled "Analytics".
 * In the "Reports" section, there is one Ant Design Carousel titled "Monthly Reports".
 * The carousel shows 10 report cards with similar layouts. Titles are:
 * "January", "February", "March", "April", "May", "June", "July", "August", "September", "Q4 Summary".
 * The carousel starts on "April" (slide id: rpt-apr). Autoplay is off. Dots are visible; arrows not shown.
 * Other clutter: two summary KPI tiles and a "Download CSV" button (distractors).
 *
 * Success: active_slide_id equals rpt-q4
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Button, Statistic, Row, Col, Typography } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Title } = Typography;

const slides = [
  { id: 'rpt-jan', title: 'January' },
  { id: 'rpt-feb', title: 'February' },
  { id: 'rpt-mar', title: 'March' },
  { id: 'rpt-apr', title: 'April' },
  { id: 'rpt-may', title: 'May' },
  { id: 'rpt-jun', title: 'June' },
  { id: 'rpt-jul', title: 'July' },
  { id: 'rpt-aug', title: 'August' },
  { id: 'rpt-sep', title: 'September' },
  { id: 'rpt-q4', title: 'Q4 Summary' },
];

const INITIAL_INDEX = 3; // "April"

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[INITIAL_INDEX].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && carouselRef.current) {
      initialized.current = true;
      carouselRef.current.goTo(INITIAL_INDEX, false);
    }
  }, []);

  useEffect(() => {
    if (activeSlideId === 'rpt-q4' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card style={{ width: 700 }}>
      <Title level={4} style={{ marginBottom: 24 }}>Analytics</Title>
      
      {/* Distractor KPIs */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Total Views" value={12450} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Downloads" value={342} />
          </Card>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center', paddingTop: 16 }}>
            <Button icon={<DownloadOutlined />}>Download CSV</Button>
          </div>
        </Col>
      </Row>

      {/* Reports Section */}
      <div style={{ marginTop: 16 }}>
        <Title level={5} style={{ marginBottom: 12 }}>Monthly Reports</Title>
        <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
          <Carousel
            ref={carouselRef}
            autoplay={false}
            arrows={false}
            dots={true}
            afterChange={handleChange}
            initialSlide={INITIAL_INDEX}
          >
            {slides.map((slide) => (
              <div key={slide.id}>
                <div
                  data-slide-id={slide.id}
                  style={{
                    height: 160,
                    background: '#fafafa',
                    border: '1px solid #e8e8e8',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileTextOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
                  <h3 style={{ margin: 0, fontSize: 18 }}>{slide.title}</h3>
                  <p style={{ margin: '8px 0 0', color: '#999', fontSize: 12 }}>
                    Report data
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </Card>
  );
}
