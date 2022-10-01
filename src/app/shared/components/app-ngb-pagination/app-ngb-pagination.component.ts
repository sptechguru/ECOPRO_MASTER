import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { environment } from "environments/environment";

@Component({
  selector: "app-ngb-pagination",
  templateUrl: "./app-ngb-pagination.component.html",
})
export class AppNgbPaginationComponent implements OnInit {

  /**Total number of entries in db returned by api */
  @Input() collectionSize: number;

  /**Entries we wanna display per page */
  _pageSize: number = 10;
  @Input()
  set pageSize(pageSize: number) {
    this._pageSize = (pageSize) ? pageSize : this._pageSize;
  }

  /**Current activated page */
  @Input() page: number;

  /**Is pagination needed to be disabled */
  @Input() isDisabled: boolean;

  /**Page change event handler */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this._pageSize = (environment.appConfig && environment.appConfig.defaultPageSize) ? environment.appConfig.defaultPageSize : 10;
  }

  ngOnInit() {
  }

  emitPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.pageChange.emit(pageNumber);
  }

}
