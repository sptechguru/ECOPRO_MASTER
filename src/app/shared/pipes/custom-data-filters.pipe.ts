import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | capitalizefirst
 * Example:
 *  // value.name = daniel
 *  {{ value.name | capitalizefirst  }}
 *  fromats to: Daniel
*/
@Pipe({
  name: 'capitalizefirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value === null) return 'Not assigned';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

/*
 * Change date format of a date object
 * Takes a date as a value.
 * Usage:
 *  value | customdate
 * Example:
 *  // value.name = new Date();
 *  {{ value.name | customdate  }}
 *  formats to: Daniel
*/
@Pipe({
  name: 'customdate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date) {
    var datePipe = new DatePipe("en-US");
    return datePipe.transform(value, 'dd/MM/yyyy');
  }
}