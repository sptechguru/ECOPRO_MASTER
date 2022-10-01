import { Component, OnInit } from '@angular/core';
import { BlogService } from 'app/shared/services/blog.service';
import { API } from 'app/shared/constants/endpoints';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

  blogDetail: any;
  default_image: any;
  blog_id: any;
  shareurl:any;

  constructor(private BlogService: BlogService, private ActivatedRoute: ActivatedRoute, 
    private Router: Router) { }

  ngOnInit(): void {
    this.blog_id = this.ActivatedRoute.snapshot.paramMap.get("id");

    this.getBlogList(this.blog_id);
    this.default_image = API.DEFAULT_CATEGORY_DETAIL_IMAGE_ENDPOINTS.DEFAULT_IMAGE;
    this.shareurl="window.location.href";
    
  }

  getBlogList(id){
    this.BlogService.getBlogDetail(id).pipe().subscribe({
      next:data=>{
          if(data["success"] = true){
            this.blogDetail = data["data"];
            console.log( this.blogDetail);
          }
        },
        error: err => {},
        complete: () => {}
    })
  }

}
