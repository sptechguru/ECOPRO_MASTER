import { Component, OnInit,Input } from '@angular/core';
import { BlogService } from 'app/shared/services/blog.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

  blogDetail: any;
  default_image: any;
  totalQueryableData: number = 0;
  pageSize: number = 9;
  page: number;
  offsets: any;
  offset: any;
  limit: any;
  isListLoading: boolean = false;
  connectLoader: boolean = false;
  @Input() isHome : boolean = false;

  constructor(private BlogService: BlogService) { }

  ngOnInit(): void {
    this.page = 1;
    this.getBlogList(this.page);
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
  }

  getBlogList(page){
    const limit = this.pageSize || 9;
    this.limit = limit;
    let data = {
      page: page
    }
    this.offset = (data.page - 1) * limit;
    this.isListLoading = true;
    this.connectLoader = true;
    this.BlogService.getBlogList(this.offset, this.limit).pipe().subscribe({
      next:data=>{
          if(data["success"] = true){
            this.connectLoader = false;
            this.isListLoading = false;
            this.blogDetail = data["data"].rows;
            console.log(this.blogDetail);
            
            this.totalQueryableData = data["data"].total;
          }
        },
        error: err => {
          this.connectLoader = false;
        },
        complete: () => {
          this.connectLoader = false;
        }
    })
  }

  handlePageChange(newPage) {
    this.connectLoader = true;
    if (newPage) {
      this.getBlogList(newPage);
    }
  }   
  
}
