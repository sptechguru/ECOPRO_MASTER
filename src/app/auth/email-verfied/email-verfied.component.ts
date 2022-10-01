import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-email-verfied',
  templateUrl: './email-verfied.component.html',
  styleUrls: ['./email-verfied.component.css']
})
export class EmailVerfiedComponent implements OnInit {

  constructor( private _route : ActivatedRoute,
                private _api : ApiHandlerService) { }

  ngOnInit() {
    let id  = this._route.snapshot.paramMap.get('code');
    this._api.apiGet(API.AUTH_ENDPOINTS.VERIFY_EMAIL+'/'+id).subscribe({
      next:result=>{
        console.log(result)
      },
      error:err=>{
        console.log(err)
      }
    })


  //   this._route.queryParams.subscribe(params => {
  //     let date = params['startdate'];
  //     console.log(date); // Print the parameter to the console.
  // });


  }

}
