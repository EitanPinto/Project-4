import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-second-panel-homepage',
  templateUrl: './second-panel-homepage.component.html',
  styleUrls: ['./second-panel-homepage.component.css']
})
export class SecondPanelHomepageComponent implements OnInit {
  public imagePath: string;
  constructor() { 
  this.imagePath = "url('/assets/upload/womanWithShoppingBag.jpg')"
  }
  ngOnInit(): void {
  }

getImagePath(){
  return this.imagePath
}
  
}
