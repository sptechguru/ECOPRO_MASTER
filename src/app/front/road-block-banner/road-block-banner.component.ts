import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { BlogService } from 'app/shared/services/blog.service';

@Component({
  selector: 'app-road-block-banner',
  templateUrl: './road-block-banner.component.html',
  styleUrls: ['./road-block-banner.component.css']
})
export class RoadBlockBannerComponent implements OnInit {
  roadBannerImg;
  offsets: any;
  offset: any;
  limit: any;
  pageSize: number = 6;
  page: number;

  constructor(
    private dialogRef: MatDialogRef<RoadBlockBannerComponent>,
    public api :ApiHandlerService,
    private BlogService: BlogService
    ) { }

  ngOnInit(): void {
    this.page = 1;
    const limit = this.pageSize || 6;
    this.limit = limit;
    let data = {
      page: this.page
    }
    this.offset = (data.page - 1) * limit;
    /*this.BlogService.roadBrackBannerImg(this.offset, this.limit).subscribe({
      next:result=>{
        if(result['data']['rows'].length != 0) {
          this.roadBannerImg = result['data']['rows'];
          console.log(this.roadBannerImg); 
        }             
      },
    })
   */
  }

   
}
