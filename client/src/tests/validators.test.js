import { describe, expect, it } from 'vitest';
import { validateBlueprintFile } from '../lib/validators';

describe('validateBlueprintFile', () => {
  it('rejects unsupported file types', () => {
    const file = new File(['x'], 'test.txt', { type: 'text/plain' });
    expect(validateBlueprintFile(file)).toContain('Only PNG, JPG, or PDF');
  });
});

