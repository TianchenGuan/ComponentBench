'use client';

/**
 * select_custom_single-mantine-v2-T14: Ingredient filter — scroll to Zucchini and apply
 *
 * Compact top-left filter panel over a recipe dashboard. Two Mantine Select controls:
 * "Ingredient" (non-searchable, long alphabetized dropdown with scroll area) and
 * "Cuisine" (Any, must stay). Target "Zucchini" is near end, not initially visible.
 * "Apply filters" commits; "Reset filters" is distractor.
 *
 * Success: Ingredient = "Zucchini", Cuisine still "Any", "Apply filters" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Group, Badge, Stack, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const INGREDIENTS = [
  'Artichoke', 'Asparagus', 'Avocado', 'Basil', 'Bean sprouts', 'Beet',
  'Bell pepper', 'Broccoli', 'Brussels sprouts', 'Cabbage', 'Carrot',
  'Cauliflower', 'Celery', 'Chard', 'Chickpea', 'Chili pepper', 'Cilantro',
  'Corn', 'Cucumber', 'Eggplant', 'Fennel', 'Garlic', 'Ginger',
  'Green bean', 'Kale', 'Leek', 'Lemon', 'Lentil', 'Lettuce',
  'Lime', 'Mushroom', 'Okra', 'Olive', 'Onion', 'Parsley',
  'Parsnip', 'Pea', 'Potato', 'Pumpkin', 'Radish', 'Rosemary',
  'Shallot', 'Spinach', 'Squash', 'Sweet potato', 'Thyme', 'Tofu',
  'Tomato', 'Turnip', 'Watercress', 'Yam', 'Zucchini',
];

const ingredientOptions = INGREDIENTS.map((i) => ({ value: i, label: i }));

const cuisineOptions = [
  { value: 'Any', label: 'Any' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Mexican', label: 'Mexican' },
  { value: 'Indian', label: 'Indian' },
  { value: 'French', label: 'French' },
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string | null>('Any');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && ingredient === 'Zucchini' && cuisine === 'Any') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, ingredient, cuisine, onSuccess]);

  return (
    <MantineProvider>
      <div style={{ padding: 16, position: 'relative', minHeight: '100vh' }}>
        <Text fw={700} size="xl" mb="md">Recipe Dashboard</Text>

        <div style={{ display: 'flex', gap: 16 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 280 }}>
            <Text fw={600} size="sm" mb="sm">Filters</Text>

            <Stack gap="sm">
              <Select
                label="Ingredient"
                data={ingredientOptions}
                value={ingredient}
                onChange={(val) => { setIngredient(val); setApplied(false); }}
                placeholder="Select ingredient"
                comboboxProps={{ position: 'bottom' }}
                maxDropdownHeight={200}
              />

              <Select
                label="Cuisine"
                data={cuisineOptions}
                value={cuisine}
                onChange={(val) => { setCuisine(val); setApplied(false); }}
              />

              <Group gap="xs">
                <Badge size="xs" variant="light">Recipes: 847</Badge>
                <Badge size="xs" variant="outline">Updated: Today</Badge>
              </Group>

              <Group gap="sm">
                <Button size="xs" onClick={() => setApplied(true)}>Apply filters</Button>
                <Button size="xs" variant="subtle" color="red" onClick={() => { setIngredient(null); setCuisine('Any'); setApplied(false); }}>
                  Reset filters
                </Button>
              </Group>
            </Stack>
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1, height: 200 }}>
            <Text c="dimmed" size="sm">Recipe results placeholder</Text>
          </Card>
        </div>
      </div>
    </MantineProvider>
  );
}
