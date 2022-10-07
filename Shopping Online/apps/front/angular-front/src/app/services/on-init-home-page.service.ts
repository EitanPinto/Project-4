import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { selectedPort } from './auth.service';


export interface IOnInitGetNumberOfOrders {
  totalNumberOfOrders: number;
  message: string;
}

export interface IOnInitGetNumberOfProducts {
  totalNumberOfProducts: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnInitHomePageService {
  private url: string = `http://localhost:${selectedPort}/onInitWebPage`
  
  constructor(private http: HttpClient) { }

  async getNumberOfAllOrders (): Promise<number>{
    const result: IOnInitGetNumberOfOrders = await lastValueFrom(this.http.get<any>(`${this.url}/orders`));
    return result.totalNumberOfOrders;
  };

  async getNumberOfAllProducts (): Promise<number>{
    const result: IOnInitGetNumberOfProducts = await lastValueFrom(this.http.get<any>(`${this.url}/products`));
    return result.totalNumberOfProducts;
  };

}
