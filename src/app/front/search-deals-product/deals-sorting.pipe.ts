import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
  transform(categories: any, searchText: any): any {
    if (searchText == null) return categories;
    
    return categories.filter( category => category.CategoryName.toLowerCase().indexOf(searchText.toLowerCase()) > -1    
      
    //   function (category) {
    //   return category.CategoryName.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    // }
    )
  }
}