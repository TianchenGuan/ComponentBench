'use client';

/**
 * carousel-antd-T15: Customize drawer: set Header banners to 'Minimal'
 *
 * The main page shows a settings overview with a button labeled "Customize homepage".
 * Clicking it opens a right-side Ant Design Drawer.
 * Inside the drawer there are two carousels:
 *   - "Header Banners" (5 slides: "Bold", "Minimal", "Photo", "Split", "Text-only")
 *   - "Footer Promotions" (3 slides: "Coupon", "Newsletter", "App download")
 * Both show dots; arrows hidden. High clutter with toggles, dropdowns, and footer buttons.
 * Initial state: Header Banners starts on "Bold" (hdr-bold); Footer on "Newsletter" (ftr-news).
 *
 * Success: Header Banners active_slide_id equals hdr-minimal
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Button, Drawer, Switch, Select, Space, Divider, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

const headerSlides = [
  { id: 'hdr-bold', title: 'Bold' },
  { id: 'hdr-minimal', title: 'Minimal' },
  { id: 'hdr-photo', title: 'Photo' },
  { id: 'hdr-split', title: 'Split' },
  { id: 'hdr-textonly', title: 'Text-only' },
];

const footerSlides = [
  { id: 'ftr-coupon', title: 'Coupon' },
  { id: 'ftr-news', title: 'Newsletter' },
  { id: 'ftr-app', title: 'App download' },
];

const FOOTER_INITIAL_INDEX = 1; // "Newsletter"

export default function T15({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [headerActiveId, setHeaderActiveId] = useState(headerSlides[0].id);
  const headerRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (headerActiveId === 'hdr-minimal' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [headerActiveId, onSuccess]);

  const handleHeaderChange = (current: number) => {
    setHeaderActiveId(headerSlides[current].id);
  };

  return (
    <>
      <Card style={{ width: 350 }}>
        <Title level={5} style={{ marginBottom: 16 }}>Settings Overview</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          Configure your homepage layout and content.
        </Text>
        <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
          Customize homepage
        </Button>
      </Card>

      <Drawer
        title="Customize homepage"
        placement="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={450}
        footer={
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="primary">Save changes</Button>
          </Space>
        }
      >
        {/* Distractor controls */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>Show welcome message</Text>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>Enable animations</Text>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Layout style</Text>
            <Select defaultValue="modern" style={{ width: 120 }}>
              <Select.Option value="modern">Modern</Select.Option>
              <Select.Option value="classic">Classic</Select.Option>
            </Select>
          </div>
        </div>

        <Divider />

        {/* Header Banners - Target */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Header Banners</Text>
          <div
            data-testid="carousel-root"
            data-instance-id="header-banners"
            data-active-slide-id={headerActiveId}
          >
            <Carousel
              ref={headerRef}
              autoplay={false}
              arrows={false}
              dots={true}
              afterChange={handleHeaderChange}
            >
              {headerSlides.map((slide) => (
                <div key={slide.id}>
                  <div
                    data-slide-id={slide.id}
                    style={{
                      height: 100,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>
                      {slide.title}
                    </span>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <Divider />

        {/* Footer Promotions - Distractor */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Footer Promotions</Text>
          <div data-testid="footer-carousel" data-instance-id="footer-promotions">
            <Carousel
              autoplay={false}
              arrows={false}
              dots={true}
              initialSlide={FOOTER_INITIAL_INDEX}
            >
              {footerSlides.map((slide) => (
                <div key={slide.id}>
                  <div
                    style={{
                      height: 80,
                      background: '#e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{slide.title}</span>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* More distractor controls */}
        <Divider />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>Auto-rotate banners</Text>
            <Switch />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Banner speed</Text>
            <Select defaultValue="normal" style={{ width: 100 }}>
              <Select.Option value="slow">Slow</Select.Option>
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="fast">Fast</Select.Option>
            </Select>
          </div>
        </div>
      </Drawer>
    </>
  );
}
