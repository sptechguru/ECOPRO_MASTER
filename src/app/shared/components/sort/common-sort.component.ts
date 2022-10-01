import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-common-sort',
  templateUrl: 'common-sort.component.html'
})
export class CommonSortComponent {
  /**Default text to be displayed on filter */
  @Input()
  set defaultText(defaultText: any) {
    console.log('defaultText : ', defaultText);
    this._defaultText = (defaultText) ? defaultText : this._defaultText;
  };
  /** Sort object in format [{key: 1, value: 'One'}, key: 2, value: 'Two'] */
  @Input() sortObject;
  /** If required to disable filter */
  @Input() isDisabled;
  /** Default value of the filter */
  @Input()
  set defaultValue(defaultValue: any) {
    this._selectedValue = (defaultValue) ? defaultValue : '';
  };
  @Output() onFilter = new EventEmitter();

  //private _selectedValue: any;
  //private _defaultText: string = '-- Select --';
  _selectedValue: any;
  _defaultText: string = '-- Select --';
  
  constructor() {
  }

  handleSorting(selectedValue) {
    this._selectedValue = selectedValue.trim();
    console.log('selectedValue : ', this._selectedValue);
    this.onFilter.emit(this._selectedValue);
  }
}
