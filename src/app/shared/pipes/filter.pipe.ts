import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterPipe', standalone: true })
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[] | null, searchText: string, field: keyof T): T[] {
    if (!items) return [];
    if (!searchText) return items;
    const lower = searchText.toLowerCase();
    return items.filter((item) => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(lower);
    });
  }
}
