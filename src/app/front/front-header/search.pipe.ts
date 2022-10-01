import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search_country',
    pure: true
  })
  export class SearchCountryPipe implements PipeTransform {
      transform(items: any[], args: string): any[] {
          if(args !== undefined){       
        args = args.toUpperCase();
        let search_results = items.filter(item => item.variant_name.toUpperCase().indexOf(args) !== -1);
        if(search_results){
          return search_results;
        }
          }
      }
  }