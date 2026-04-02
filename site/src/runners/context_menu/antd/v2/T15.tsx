'use client';

/**
 * context_menu-antd-v2-T15: Photo card 3 — Display → Pinned ON
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

type Disp = { pinned: boolean; caption: boolean; histogram: boolean };

const INITIAL: Record<string, Disp> = {
  'Photo card 1': { pinned: true, caption: false, histogram: true },
  'Photo card 2': { pinned: false, caption: true, histogram: false },
  'Photo card 3': { pinned: false, caption: true, histogram: true },
  'Photo card 4': { pinned: true, caption: true, histogram: false },
};

export default function T15({ onSuccess }: TaskComponentProps) {
  const [disp, setDisp] = useState<Record<string, Disp>>(() => ({ ...INITIAL }));
  const [openCard, setOpenCard] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const othersPinnedOk =
      disp['Photo card 1']?.pinned === INITIAL['Photo card 1'].pinned &&
      disp['Photo card 2']?.pinned === INITIAL['Photo card 2'].pinned &&
      disp['Photo card 4']?.pinned === INITIAL['Photo card 4'].pinned;
    if (disp['Photo card 3']?.pinned === true && othersPinnedOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [disp, onSuccess]);

  const panel = (card: string) => {
    const d = disp[card];
    const items: MenuProps['items'] = [
      { key: 'open', label: 'Open' },
      {
        key: 'display',
        label: 'Display',
        children: [
          {
            key: 'pinned',
            label: `${d.pinned ? '✓ ' : ''}Pinned`,
          },
          {
            key: 'caption',
            label: `${d.caption ? '✓ ' : ''}Show caption`,
          },
          {
            key: 'histogram',
            label: `${d.histogram ? '✓ ' : ''}Show histogram`,
          },
        ],
      },
      { key: 'remove', label: 'Remove', danger: true },
    ];

    const onClick: MenuProps['onClick'] = ({ key }) => {
      if (key === 'pinned' || key === 'caption' || key === 'histogram') {
        setDisp((prev) => ({
          ...prev,
          [card]: { ...prev[card], [key]: !prev[card][key as keyof Disp] },
        }));
        setTimeout(() => setOpenCard(card), 0);
      }
    };

    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Menu
          mode="vertical"
          selectable={false}
          triggerSubMenuAction="click"
          items={items}
          onClick={onClick}
          style={{ border: 'none' }}
        />
      </div>
    );
  };

  return (
    <div style={{ width: 460, fontSize: 11 }}>
      <div style={{ color: '#888', marginBottom: 6 }}>Photo board</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['Photo card 1', 'Photo card 2', 'Photo card 3', 'Photo card 4'] as const).map((c) => (
          <Dropdown
            key={c}
            open={openCard === c}
            onOpenChange={(o) => setOpenCard(o ? c : null)}
            dropdownRender={() => panel(c)}
            trigger={['contextMenu']}
          >
            <div
              style={{
                width: 100,
                height: 120,
                background: `linear-gradient(160deg,#f0f0f0,${c === 'Photo card 3' ? '#d6e4ff' : '#e6e6e6'})`,
                borderRadius: 8,
                border: '1px solid #d9d9d9',
                cursor: 'context-menu',
                padding: 6,
                fontSize: 10,
              }}
              data-instance-label={c}
              data-testid={`photo-${c.replace(/\s/g, '-').toLowerCase()}`}
            >
              <strong>{c}</strong>
            </div>
          </Dropdown>
        ))}
      </div>
    </div>
  );
}
