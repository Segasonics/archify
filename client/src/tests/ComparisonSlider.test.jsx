import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ComparisonSlider from '../components/project/ComparisonSlider';

describe('ComparisonSlider', () => {
  it('renders before and after labels', () => {
    render(
      <ComparisonSlider
        beforeImage="https://example.com/before.jpg"
        afterImage="https://example.com/after.jpg"
      />,
    );

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });
});

