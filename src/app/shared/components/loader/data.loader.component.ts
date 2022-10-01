import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-loader',
  styleUrls: ['./data.loader.component.css'],
  template: `<span class="loader-center">
                <mat-spinner [mode]="mode" [diameter]="diameter" [color]="color"></mat-spinner>
             </span>`,
})
export class DataLoaderComponent implements OnInit {
  diameter: number = 30;
  color: string = 'accent';//primary, warn or accent
  mode: string = 'indeterminate'; //determinate or indeterminate
  constructor() { }

  ngOnInit() { }
}
