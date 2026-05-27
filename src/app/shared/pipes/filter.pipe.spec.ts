import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  const pipe = new FilterPipe();
  const items = [
    { name: 'Arrow', category: 'Navigation' },
    { name: 'Home', category: 'General' },
    { name: 'Search', category: 'Navigation' },
  ];

  it('returns all items when no search text', () => {
    expect(pipe.transform(items, '', 'name')).toEqual(items);
  });

  it('filters by property', () => {
    const result = pipe.transform(items, 'Arrow', 'name');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Arrow');
  });

  it('is case insensitive', () => {
    const result = pipe.transform(items, 'arrow', 'name');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Arrow');
  });

  it('handles null input', () => {
    expect(pipe.transform(null, 'test', 'name')).toEqual([]);
  });

  it('handles empty array', () => {
    expect(pipe.transform([], 'test', 'name')).toEqual([]);
  });
});
