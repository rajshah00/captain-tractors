// search.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
  
    searchText = searchText.toLowerCase();
  
    return items.filter(item => {
      // Ensure item.name and item.title are defined and are strings
      const nameMatches = item.name && typeof item.name === 'string' && item.name.toLowerCase().includes(searchText);
      const titleMatches = item.title && typeof item.title === 'string' && item.title.toLowerCase().includes(searchText);
      
      return nameMatches || titleMatches;
    });
  }
  
}
