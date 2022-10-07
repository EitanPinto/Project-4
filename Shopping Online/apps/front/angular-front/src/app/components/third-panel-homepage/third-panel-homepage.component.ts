import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnInitHomePageService } from 'src/app/services/on-init-home-page.service';

@Component({
  selector: 'app-third-panel-homepage',
  templateUrl: './third-panel-homepage.component.html',
  styleUrls: ['./third-panel-homepage.component.css']
})
export class ThirdPanelHomepageComponent implements OnInit {
  public numberOfAllOrders: number;
  public numberOfAllProducts: number;
  constructor(public OnInitHomePageService: OnInitHomePageService, public authService: AuthService) {
  this.numberOfAllOrders = 0;
  this.numberOfAllProducts = 0;
   }
  async ngOnInit(): Promise<void> {
    const numberOfAllOrders: number = await this.OnInitHomePageService.getNumberOfAllOrders();
    this.numberOfAllOrders = numberOfAllOrders;
    const numberOfAllProducts: number = await this.OnInitHomePageService.getNumberOfAllProducts();
    this.numberOfAllProducts = numberOfAllProducts;
  }

}
