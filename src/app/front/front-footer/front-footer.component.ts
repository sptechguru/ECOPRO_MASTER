import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-footer',
  templateUrl: './front-footer.component.html',
  styleUrls: ['./front-footer.component.scss']
})
export class FrontFooterComponent implements OnInit {
  appName = environment.appName;
  currentYear: Number = 0;
  termsUrl: any;
  privacyUrl: any;

  constructor(public localStorage : StorageAccessorService, public _router: Router) {
    let currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.privacyUrl = environment.AssetsUrl+'/pdf/ek-matra-privacy-policy.pdf';
    this.termsUrl = environment.AssetsUrl+'/pdf/ek-matra-terms-of-use.pdf';
  }

}
