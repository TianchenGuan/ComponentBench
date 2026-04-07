'use client';

// A simple coffee order form where the user selects a size and milk type, then places the order to see a confirmation.
import React, { useMemo, useState } from 'react';

interface TaskComponentProps {
  task: any;
  onSuccess: () => void;
}

const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const milks = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'oat', label: 'Oat' },
  { value: 'almond', label: 'Almond' },
];

export default function PlaygroundTask({ task, onSuccess }: TaskComponentProps) {
  const [size, setSize] = useState('');
  const [milk, setMilk] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const canSubmit = useMemo(() => size !== '' && milk !== '', [milk, size]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setSubmitted(true);
    if (!hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background:
          'linear-gradient(180deg, #f8efe4 0%, #f2dfc8 45%, #e8c9a4 100%)',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#fffaf4',
          border: '1px solid #d8bfa3',
          borderRadius: 20,
          boxShadow: '0 18px 50px rgba(90, 58, 33, 0.16)',
          padding: 28,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: '#8b5e3c',
              marginBottom: 8,
            }}
          >
            Coffee Order
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.15,
              color: '#3f2a1d',
            }}
          >
            Build your drink
          </h1>
          <p style={{ margin: '10px 0 0', color: '#6f5543', lineHeight: 1.5 }}>
            Pick a size, choose your milk, and place the order.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset
            style={{
              border: 'none',
              padding: 0,
              margin: 0,
              marginBottom: 20,
            }}
          >
            <legend
              style={{
                fontWeight: 600,
                color: '#4e3526',
                marginBottom: 10,
              }}
            >
              Size
            </legend>
            <div style={{ display: 'grid', gap: 10 }}>
              {sizes.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: size === option.value ? '2px solid #8b5e3c' : '1px solid #d7c1aa',
                    background: size === option.value ? '#f4e3cf' : '#fff',
                    cursor: 'pointer',
                    color: '#4a3425',
                  }}
                >
                  <input
                    type="radio"
                    name="size"
                    value={option.value}
                    checked={size === option.value}
                    onChange={(event) => {
                      setSize(event.target.value);
                      setSubmitted(false);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset
            style={{
              border: 'none',
              padding: 0,
              margin: 0,
              marginBottom: 24,
            }}
          >
            <legend
              style={{
                fontWeight: 600,
                color: '#4e3526',
                marginBottom: 10,
              }}
            >
              Milk Type
            </legend>
            <div style={{ display: 'grid', gap: 10 }}>
              {milks.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: milk === option.value ? '2px solid #8b5e3c' : '1px solid #d7c1aa',
                    background: milk === option.value ? '#f4e3cf' : '#fff',
                    cursor: 'pointer',
                    color: '#4a3425',
                  }}
                >
                  <input
                    type="radio"
                    name="milk"
                    value={option.value}
                    checked={milk === option.value}
                    onChange={(event) => {
                      setMilk(event.target.value);
                      setSubmitted(false);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 999,
              border: 'none',
              background: canSubmit ? '#6b4226' : '#c7b4a2',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            Place Order
          </button>
        </form>

        {submitted && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 14,
              background: '#e7f6ea',
              border: '1px solid #98c7a1',
              color: '#224b2b',
              lineHeight: 1.5,
            }}
          >
            Order placed! Your {size} coffee with {milk} milk is being prepared.
          </div>
        )}

        {task?.prompt && (
          <p style={{ marginTop: 16, marginBottom: 0, color: '#8a6c57', fontSize: 13 }}>
            {task.prompt}
          </p>
        )}
      </div>
    </div>
  );
}
