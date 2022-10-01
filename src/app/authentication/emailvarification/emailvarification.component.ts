import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/shared/constants/endpoints';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emailvarification',
  templateUrl: './emailvarification.component.html',
  styleUrls: ['./emailvarification.component.css']
})
export class EmailvarificationComponent implements OnInit {
 
  constructor( private route : ActivatedRoute,private api : ApiHandlerService) { }
  

  ngOnInit(): void {
    let id  = this.route.snapshot.paramMap.get('code');
    this.api.apiGet(API.AUTH_ENDPOINTS.VERIFY_EMAIL+'/'+id).subscribe({
      next:result=>{
      },
      error:err=>{
      }
    })
  }


}
