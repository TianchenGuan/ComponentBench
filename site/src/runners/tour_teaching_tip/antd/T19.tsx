'use client';

/**
 * tour_teaching_tip-antd-T19: Checkout form: jump to Advanced options via step list
 *
 * setup_description:
 * A form_section layout is displayed (light theme, comfortable spacing) showing a simple checkout form with labeled groups: "Shipping", "Delivery", "Payment", and "Review".
 * Above the form there is a button labeled "Start Checkout Tour". The page includes a few other form inputs (low clutter) but they are not required for success.
 * Clicking "Start Checkout Tour" opens an AntD Tour with 5 steps. The Tour uses a custom indicator sidebar (indicatorsRender) that lists step titles as clickable items:
 * "Shipping address", "Delivery method", "Payment details", "Advanced options", "Review & submit".
 * The Tour is initially closed; when open, the indicator sidebar remains visible and clicking an item jumps directly to that step.
 *
 * success_trigger: Tour overlay is open, current step title is "Advanced options", current step index equals 3.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Input, Select, Space, Divider, Menu } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T19({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const shippingRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const stepTitles = [
    'Shipping address',
    'Delivery method',
    'Payment details',
    'Advanced options',
    'Review & submit',
  ];

  const steps: TourProps['steps'] = [
    {
      title: 'Shipping address',
      description: 'Enter your shipping address.',
      target: () => shippingRef.current!,
    },
    {
      title: 'Delivery method',
      description: 'Choose your preferred delivery method.',
      target: () => deliveryRef.current!,
    },
    {
      title: 'Payment details',
      description: 'Add your payment information.',
      target: () => paymentRef.current!,
    },
    {
      title: 'Advanced options',
      description: 'Configure advanced order options.',
      target: () => advancedRef.current!,
    },
    {
      title: 'Review & submit',
      description: 'Review your order and submit.',
      target: () => reviewRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 3 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Advanced options') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 3 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Advanced options') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  const indicatorsRender: TourProps['indicatorsRender'] = (currentStep) => (
    <div style={{ marginTop: 12 }}>
      <Menu
        mode="vertical"
        selectedKeys={[String(currentStep)]}
        style={{ border: 'none', background: 'transparent' }}
        items={stepTitles.map((title, index) => ({
          key: String(index),
          label: title,
          onClick: () => setCurrent(index),
        }))}
      />
    </div>
  );

  return (
    <>
      <Card style={{ width: 500 }} data-testid="checkout-form">
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setCurrent(0);
          }}
          style={{ marginBottom: 16 }}
          data-testid="start-checkout-tour-btn"
        >
          Start Checkout Tour
        </Button>

        <Divider />

        {/* Shipping */}
        <div ref={shippingRef} style={{ marginBottom: 16 }} data-testid="shipping-section">
          <h4>Shipping</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Address line 1" />
            <Input placeholder="City, State, ZIP" />
          </Space>
        </div>

        {/* Delivery */}
        <div ref={deliveryRef} style={{ marginBottom: 16 }} data-testid="delivery-section">
          <h4>Delivery</h4>
          <Select defaultValue="standard" style={{ width: '100%' }}>
            <Select.Option value="standard">Standard (5-7 days)</Select.Option>
            <Select.Option value="express">Express (2-3 days)</Select.Option>
            <Select.Option value="overnight">Overnight</Select.Option>
          </Select>
        </div>

        {/* Payment */}
        <div ref={paymentRef} style={{ marginBottom: 16 }} data-testid="payment-section">
          <h4>Payment</h4>
          <Input placeholder="Card number" />
        </div>

        {/* Advanced */}
        <div ref={advancedRef} style={{ marginBottom: 16 }} data-testid="advanced-section">
          <h4>Advanced Options</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Gift message (optional)" />
            <Input placeholder="Promo code" />
          </Space>
        </div>

        {/* Review */}
        <div ref={reviewRef} data-testid="review-section">
          <h4>Review</h4>
          <p style={{ color: '#666' }}>Review your order before submitting.</p>
          <Button type="primary">Submit Order</Button>
        </div>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        indicatorsRender={indicatorsRender}
        data-testid="tour-checkout"
      />
    </>
  );
}
