import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent implements OnInit {
data:any=[]
  constructor() { }

  ngOnInit(): void {
    this.data=[
      {
          "rating": 5,
          "name": "Gaurav",
          "image":"assets/images/img001.jpg",
          "description": "Supporting staff very good. They are really helpful."
      },
      {
          "rating": 5,
          "name": "Dinesh",
          "image":"assets/images/review-img-2.jpg",
          "description": "Excellent initiative to fill the void which was there in gifting industry."
      },
      {
          "rating": 5,
          "name": "Chaitanya",
          "image":"assets/images/img3.jpg",
          "description": "Team at Ek Matra helped us in delivering orders to client ontime during holidays too. Their post sales support is a wow thing .. Cheers !!"
      },
      {
          "rating": 5,
          "name": "Ashish",
          "image":"assets/images/img2.png",
          "description": "I really love the feature of me able to create a pdf where I can choose products, add my margin over the price quoted and download which is ready to share with the client. Very unique and useful."
      },
      {
          "rating": 5,
          "name": "Nagendran",
          "image":"assets/images/img1.png",
          "description": "From the day 1 we started gifting, we are connected with EKMATRA"
      },
      {
        "rating": 5,
        "name": "Siddharth",
        "image":"assets/images/img4.png",
        "description": "Ek Matra has solved one of my biggest problems of making constant catalogue for clients. Now I can make my company's catalogue with minutes. Wonderful feature. Kudos."
    }
  ]
  }

}
