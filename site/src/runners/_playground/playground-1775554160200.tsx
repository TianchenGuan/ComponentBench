'use client';

// "Theater seating: confirm any 3 available seats" — Pick exactly 3 available seats in the theater seat map, avoiding the grayed-out booked seats, then click "Confirm Selection".
import React, { useMemo, useState } from 'react';

interface TaskComponentProps {
  task: any;
  onSuccess: () => void;
}

const rows = ['A', 'B', 'C', 'D', 'E'];
const columns = [1, 2, 3, 4, 5, 6];

const bookedSeats = new Set(['A2', 'A5', 'B4', 'C1', 'C6', 'D3', 'E2', 'E5']);
const premiumSeats = new Set(['B2', 'B3', 'C2', 'C3', 'C4', 'D4', 'D5']);
const allowedSeats = new Set([
  'A1',
  'A3',
  'A4',
  'A6',
  'B1',
  'B2',
  'B3',
  'B5',
  'B6',
  'C2',
  'C3',
  'C4',
  'C5',
  'D1',
  'D2',
  'D4',
  'D5',
  'D6',
  'E1',
  'E3',
  'E4',
  'E6',
]);

function getSeatStatus(seatId: string) {
  if (bookedSeats.has(seatId)) {
    return 'booked';
  }
  if (premiumSeats.has(seatId)) {
    return 'premium';
  }
  return 'regular';
}

export default function PlaygroundTask({ task, onSuccess }: TaskComponentProps) {
  void task;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [confirmedSelection, setConfirmedSelection] = useState<string[]>([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const isConfirmed = confirmedSelection.length === 3;
  const selectedCount = selectedSeats.length;

  const helperText = useMemo(() => {
    if (isConfirmed) {
      return 'Ready to confirm';
    }
    if (selectedCount === 3) {
      return 'Ready to confirm';
    }
    return 'Choose exactly 3 seats to continue';
  }, [isConfirmed, selectedCount]);

  const handleSeatToggle = (seatId: string) => {
    if (isConfirmed || bookedSeats.has(seatId)) {
      return;
    }

    setValidationMessage('');
    setSelectedSeats((current) =>
      current.includes(seatId) ? current.filter((id) => id !== seatId) : [...current, seatId]
    );
  };

  const handleConfirm = () => {
    const isValid =
      selectedSeats.length === 3 && selectedSeats.every((seatId) => allowedSeats.has(seatId));

    if (!isValid) {
      setValidationMessage('Choose exactly 3 available seats to continue.');
      return;
    }

    setValidationMessage('');
    setConfirmedSelection([...selectedSeats]);
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
        background: '#f4f6fb',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        aria-label="Theater seat selection"
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#ffffff',
          border: '1px solid #d9e0ea',
          borderRadius: 20,
          boxShadow: '0 18px 44px rgba(31, 41, 55, 0.10)',
          padding: 28,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: '#516074',
            }}
          >
            Small Theater
          </p>
          <h1
            style={{
              margin: '8px 0 10px',
              fontSize: 28,
              lineHeight: 1.1,
              color: '#152033',
            }}
          >
            Choose Your Seats
          </h1>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#5b687a' }}>
            Select exactly 3 seats.
          </p>
        </div>

        <div
          aria-label="Seat legend"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}
        >
          {[
            { label: 'Booked', color: '#c9ced6', textColor: '#5e6877' },
            { label: 'Premium', color: '#e6b94d', textColor: '#5b4308' },
            { label: 'Regular', color: '#5f87d6', textColor: '#ffffff' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                background: '#f6f8fb',
                border: '1px solid #dde4ee',
                color: '#364255',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: item.color,
                  boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.10)',
                  display: 'inline-block',
                }}
              />
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(6, 1fr)', gap: 8 }}>
          <div />
          {columns.map((column) => (
            <div
              key={`column-${column}`}
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#657489',
                paddingBottom: 2,
              }}
            >
              {column}
            </div>
          ))}

          {rows.map((row) => (
            <React.Fragment key={row}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#445168',
                }}
              >
                {row}
              </div>
              {columns.map((column) => {
                const seatId = `${row}${column}`;
                const status = getSeatStatus(seatId);
                const isBooked = status === 'booked';
                const isSelected = selectedSeats.includes(seatId);

                const backgroundColor = isSelected
                  ? '#173a74'
                  : status === 'premium'
                    ? '#e6b94d'
                    : status === 'booked'
                      ? '#c9ced6'
                      : '#5f87d6';
                const textColor = isSelected
                  ? '#ffffff'
                  : status === 'premium'
                    ? '#4b3809'
                    : status === 'booked'
                      ? '#5d6674'
                      : '#ffffff';
                const border = isSelected
                  ? '2px solid #0f2851'
                  : status === 'booked'
                    ? '1px solid #b5bcc7'
                    : '1px solid rgba(15, 30, 60, 0.12)';

                return (
                  <button
                    key={seatId}
                    type="button"
                    data-seat-id={seatId}
                    data-seat-status={status}
                    data-selected={isSelected ? 'true' : 'false'}
                    aria-pressed={isBooked ? undefined : isSelected}
                    aria-disabled={isBooked || isConfirmed}
                    disabled={isBooked || isConfirmed}
                    onClick={() => handleSeatToggle(seatId)}
                    style={{
                      minHeight: 48,
                      borderRadius: 12,
                      border,
                      background: backgroundColor,
                      color: textColor,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: isBooked || isConfirmed ? 'not-allowed' : 'pointer',
                      opacity: isBooked ? 0.9 : 1,
                      transition: 'transform 120ms ease, box-shadow 120ms ease',
                      boxShadow: isSelected ? '0 8px 18px rgba(23, 58, 116, 0.26)' : 'none',
                    }}
                  >
                    {seatId}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            marginTop: 22,
            padding: 16,
            borderRadius: 14,
            background: '#f7f9fc',
            border: '1px solid #dde4ee',
          }}
        >
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#162033' }}>
            Selected: {selectedCount} of 3
          </p>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 14,
              color: selectedCount === 3 ? '#0f5d35' : '#5c687b',
            }}
          >
            {helperText}
          </p>
          {validationMessage && (
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#b42318' }}>{validationMessage}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirmed || selectedCount !== 3}
          style={{
            width: '100%',
            marginTop: 18,
            padding: '14px 18px',
            borderRadius: 999,
            border: 'none',
            background: isConfirmed || selectedCount === 3 ? '#183c77' : '#b8c3d8',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 700,
            cursor: isConfirmed || selectedCount === 3 ? 'pointer' : 'not-allowed',
          }}
        >
          Confirm Selection
        </button>

        {isConfirmed && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 14,
              border: '1px solid #b8e2c8',
              background: '#edf9f1',
              color: '#12512f',
              fontWeight: 700,
            }}
          >
            Selection confirmed for 3 seats
          </div>
        )}
      </section>
    </div>
  );
}
