import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-common-search',
  templateUrl: 'common-search.component.html'
})
export class CommonSearchComponent implements AfterViewInit {
  query: string;

  _isSearchAsTypeOn: boolean;

  @Output() onQuery = new EventEmitter();

  @Input() placeholderText = 'Search...';

  @ViewChild('searchInput') searchEl: ElementRef;

  @Input()
  set isSearchAsTypeOn(val) {
    this._isSearchAsTypeOn = val;
    // if (this._isSearchAsTypeOn === true) {
    //   const keyUpEv = Observable.fromEvent(
    //     this.searchEl.nativeElement,
    //     'keyup'
    //   );
    //   const debouncedKeyupEv = keyUpEv.debounce(() => Observable.interval(950));
    //   debouncedKeyupEv.subscribe({
    //     next: () => {
    //       this.query = this.searchEl.nativeElement.value;
    //       this.onQuery.emit(this.query.trim());
    //     }
    //   });
    // }
  }

  ngAfterViewInit() {
    if (this._isSearchAsTypeOn === true) {
      const keyUpEv = Observable.fromEvent(
        this.searchEl.nativeElement,
        'keyup'
      );
      const debouncedKeyupEv = keyUpEv.debounce(() => Observable.interval(950));
      debouncedKeyupEv.subscribe({
        next: () => {
          this.query = this.searchEl.nativeElement.value;
          this.onQuery.emit(this.query.trim());
        }
      });
    }
  }

  constructor() { }

  handleQuerying(event, query: string) {
    if (!this._isSearchAsTypeOn && event['key'] === 'Enter') {
      this.query = query;
      this.onQuery.emit(this.query.trim());
    }

    if (event instanceof MouseEvent) {
      this.query = query;
      this.onQuery.emit(this.query.trim());
    }
  }
  trimSearchData(event) {
    this.searchEl.nativeElement.value = event.target.value.trim();
  }
}
