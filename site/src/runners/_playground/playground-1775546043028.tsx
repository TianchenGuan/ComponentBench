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

const milkTypes = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'oat', label: 'Oat' },
  { value: 'almond', label: 'Almond' },
];

export default function PlaygroundTask({ task, onSuccess }: TaskComponentProps) {
  const [size, setSize] = useState('');
  const [milkType, setMilkType] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completed, setCompleted] = useState(false);

  const canSubmit = useMemo(() => size !== '' && milkType !== '', [milkType, size]);

  const handlePlaceOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setOrderPlaced(true);
    if (!completed) {
      setCompleted(true);
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
        background: 'linear-gradient(180deg, #f6ede3 0%, #e9d1b6 50%, #d9b089 100%)',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        aria-label="Coffee order form"
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#fffaf4',
          borderRadius: 20,
          border: '1px solid #d8bfa3',
          boxShadow: '0 18px 48px rgba(91, 57, 28, 0.15)',
          padding: 28,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              margin: 0,
              color: '#8b5e3c',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
            }}
          >
            Coffee Order
          </p>
          <h1
            style={{
              margin: '8px 0 10px',
              color: '#3f2a1d',
              fontSize: 30,
              lineHeight: 1.1,
            }}
          >
            Build your drink
          </h1>
          <p style={{ margin: 0, color: '#6f5543', lineHeight: 1.5 }}>
            Choose a size, pick a milk type, and place your order.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
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
                marginBottom: 10,
                color: '#4e3526',
                fontWeight: 600,
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
                    cursor: 'pointer',
                    color: '#4a3425',
                    background: size === option.value ? '#f4e3cf' : '#fff',
                    border: size === option.value ? '2px solid #8b5e3c' : '1px solid #d7c1aa',
                  }}
                >
                  <input
                    type="radio"
                    name="size"
                    value={option.value}
                    checked={size === option.value}
                    onChange={(event) => {
                      setSize(event.target.value);
                      setOrderPlaced(false);
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
                marginBottom: 10,
                color: '#4e3526',
                fontWeight: 600,
              }}
            >
              Milk Type
            </legend>
            <div style={{ display: 'grid', gap: 10 }}>
              {milkTypes.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: '#4a3425',
                    background: milkType === option.value ? '#f4e3cf' : '#fff',
                    border:
                      milkType === option.value ? '2px solid #8b5e3c' : '1px solid #d7c1aa',
                  }}
                >
                  <input
                    type="radio"
                    name="milkType"
                    value={option.value}
                    checked={milkType === option.value}
                    onChange={(event) => {
                      setMilkType(event.target.value);
                      setOrderPlaced(false);
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
              border: 'none',
              borderRadius: 999,
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

        {orderPlaced && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 14,
              background: '#efe4d7',
              color: '#4b3423',
              border: '1px solid #d9bda1',
            }}
          >
            Order placed: {sizes.find((option) => option.value === size)?.label} coffee with{' '}
            {milkTypes.find((option) => option.value === milkType)?.label.toLowerCase()} milk.
          </div>
        )}
      </section>
    </div>
  );
}
