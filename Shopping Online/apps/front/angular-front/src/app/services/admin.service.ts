import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { IProductsByCategory } from './shopping.service';
import { lastValueFrom } from 'rxjs';
import { selectedPort } from './auth.service';

export interface IupdateItemBody {
  id: number;
  name?: string;
  categoryId?: number;
  price?: string;
  image?: string;
};

export interface ICreateItemBody {
  name: string;
  categoryId: number;
  price: string;
  image: string;
};


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminPathUrl: string = `http://localhost:${selectedPort}/admin`
  constructor(private http: HttpClient) { }

  async getProductById (productId: number): Promise<IProductsByCategory>{
    const result: { message: string, selectedProduct: IProductsByCategory } = await lastValueFrom(
      this.http.get<{ message: string, selectedProduct: IProductsByCategory }>(
        `${this.adminPathUrl}/get_item_by_id?productId=${productId}`)
      );
    return result.selectedProduct as IProductsByCategory;
  };


  async updateItem (updateItemObj: IupdateItemBody): 
  Promise<HttpEvent<HttpResponse<{success_message: string}>> | HttpErrorResponse>{
    const options = { observe: 'response' as any }
    const result = await lastValueFrom(
      this.http.put<any>(`${this.adminPathUrl}/update_item`, updateItemObj, options)
      );
    return result;
  };

  async createItem (createItemObj: ICreateItemBody): 
  Promise<HttpEvent<HttpResponse<{success_message: string}>> | HttpErrorResponse>{
    const options = { observe: 'response' as any }
    const result = await lastValueFrom(
      this.http.post<any>(`${this.adminPathUrl}/add_item`, createItemObj, options)
      );
    return result;
  };

};
