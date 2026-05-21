'use client';

/**
 * select_custom_single-mantine-T07: Scroll to select Zucchini in a compact small select
 *
 * Layout: isolated card anchored near the top-left of the viewport.
 * The scene uses compact spacing and the Select is rendered in a small size tier.
 *
 * The card contains one Mantine Select labeled "Ingredient".
 * Configuration: searchable=false (no typing to filter).
 *
 * Initial state: empty (placeholder "Pick ingredient").
 * The dropdown list contains ~80 ingredients in alphabetical order and has a fixed height with an internal scrollbar.
 * The target "Zucchini" is near the end and not visible until you scroll the dropdown.
 *
 * No other controls are present.
 * Feedback: selecting an ingredient immediately updates the field and closes the dropdown.
 *
 * Success: The Mantine Select labeled "Ingredient" has selected value exactly "Zucchini".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const ingredients = [
  'Apple', 'Apricot', 'Artichoke', 'Asparagus', 'Avocado',
  'Banana', 'Basil', 'Bean sprouts', 'Beef', 'Beet', 'Blackberry', 'Blueberry', 'Broccoli', 'Brussels sprouts',
  'Cabbage', 'Cantaloupe', 'Carrot', 'Cauliflower', 'Celery', 'Cherry', 'Chicken', 'Chives', 'Cilantro', 'Coconut', 'Corn', 'Cranberry', 'Cucumber',
  'Dates', 'Dill',
  'Eggplant', 'Endive',
  'Fennel', 'Fig',
  'Garlic', 'Ginger', 'Grape', 'Grapefruit', 'Green beans', 'Guava',
  'Honeydew',
  'Jackfruit', 'Jalapeño',
  'Kale', 'Kiwi', 'Kohlrabi',
  'Leek', 'Lemon', 'Lettuce', 'Lime', 'Lychee',
  'Mango', 'Melon', 'Mint', 'Mushroom',
  'Nectarine',
  'Okra', 'Olive', 'Onion', 'Orange', 'Oregano',
  'Papaya', 'Parsley', 'Parsnip', 'Peach', 'Pear', 'Peas', 'Pepper', 'Pineapple', 'Plum', 'Pomegranate', 'Pork', 'Potato', 'Pumpkin',
  'Radish', 'Raspberry', 'Rhubarb', 'Rosemary',
  'Sage', 'Shallot', 'Spinach', 'Squash', 'Strawberry', 'Sweet potato',
  'Thyme', 'Tofu', 'Tomato', 'Turkey', 'Turnip',
  'Watercress', 'Watermelon',
  'Yam',
  'Zucchini',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Zucchini') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={600} size="md" mb="sm">Recipe builder</Text>
      <Select
        data-testid="ingredient-select"
        label="Ingredient"
        placeholder="Pick ingredient"
        data={ingredients.map(i => ({ value: i, label: i }))}
        value={value}
        onChange={handleChange}
        size="sm"
        maxDropdownHeight={200}
      />
    </Card>
  );
}
