import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from 'app/components/sidebar/sidebar.component';

@Component({
  selector: 'app-front-layout',
  templateUrl: './front-layout.component.html',
  styleUrls: ['./front-layout.component.css']
})
export class FrontLayoutComponent implements OnInit {
  @ViewChild('drawer') drawer: SidebarComponent;

  constructor() { 
  }

  ngOnInit(){
   
  }

}
