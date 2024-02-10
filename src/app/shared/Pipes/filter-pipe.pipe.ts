import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, property?:string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    if(property){
      return items.filter(it => {
        return it[property].toLocaleLowerCase().includes(searchText);
      });
    }
    else{
      return items.filter(it => {
        return it.toLocaleLowerCase().includes(searchText);
      });
    }
  }

}
