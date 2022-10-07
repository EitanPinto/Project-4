import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { selectedPort } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { ILoginResponse } from '../components/log-in/log-in.component';


export interface IProductCategories {
  id: number; 
  name: string; 
};

export interface IProductsByCategory {
  id: number;
  name: string;
  category_id: number;
  price: string;
  image: string;
};

export interface IRecentlyOpenedCart {
  id: number;
  customer_id: number;
  created_at: object;
};

export interface IupdateCartBody {
  productId: number;
  quantity: number;
  cartId: number;
};

export interface IsubmitOrderBody {
  customerId: number;
  cartId: number;
  finalPrice: string;
  city: string;
  street: string;
  houseNumber: number;
  dateTime: string;
  last4DigitsCc: number;
};

export interface IOrderDB {
  id: number;
  customer_id: number;
  cart_id: number;
  final_price: string;
  ship_city: string;
  ship_street: string;
  ship_house_number: number;
  ship_date_time: object;
  order_submitted_at: object;
  last_4_digits_credit_card: number;
  };

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private shoppingPathUrl: string = `http://localhost:${selectedPort}/shopping`
  private ordersPathUrl: string = `http://localhost:${selectedPort}/orders`
  constructor(private http: HttpClient) { }

  async getProductCategories (): Promise<Array<IProductCategories>>{
    const result: { productCategories:Array<IProductCategories>, message: string } = await lastValueFrom(
      this.http.get<{ productCategories:Array<IProductCategories>, message: string }>(`${this.shoppingPathUrl}/product_categories`)
      );
    const productCategories: Array<IProductCategories> = result.productCategories;
    return productCategories;
  };

  async getProductsByCategory (
    categoryId: number, 
    page: number
    ): Promise<[] | Array<IProductsByCategory>>{
    const result: { products: Array<IProductsByCategory>, message: string } = await lastValueFrom(
      this.http.get<{ products: Array<IProductsByCategory> | [], message: string }>(
        `${this.shoppingPathUrl}/products_by_category?categoryId=${categoryId}&page=${page}`
        )
      );
    const products: Array<IProductsByCategory> = result.products;
    return products;
  };

  async getSearchedProducts (
    searchedProduct: string | undefined, 
    page: number
    ): Promise<[] | Array<IProductsByCategory>>{
    const result: { products: Array<IProductsByCategory>, message: string } = await lastValueFrom(
      this.http.get<{ products: Array<IProductsByCategory> | [], message: string }>(
        `${this.shoppingPathUrl}/search_products_by_free_text?searchedProduct=${searchedProduct}&page=${page}`
        )
      );
    const products: Array<IProductsByCategory> = result.products;
    return products;
  };

  async openNewCartForClient (userId: {userId: number}): Promise<HttpEvent<HttpResponse<any>> | HttpErrorResponse>{
    const options = { observe: 'response' as any }
    const result = await lastValueFrom(
      this.http.post<any>(`${this.shoppingPathUrl}/open_new_cart`, userId, options)
      );
    return result;
  };

  async updateCartForClient (updateCartObj: IupdateCartBody): 
  Promise<HttpEvent<HttpResponse<{
    message: string, 
    currentProductsInCart: ILoginResponse["currentProductsInCart"],
    currentTotalCartPrice: string
  }>> | HttpErrorResponse>{
    const options = { observe: 'response' as any }
    const result = await lastValueFrom(
      this.http.put<any>(`${this.shoppingPathUrl}/update_open_cart`, updateCartObj, options)
      );
    return result;
  };

  async deleteItemsFromClientOpenCart (currentProductLocationInTable: number, cartId: number): 
  Promise<HttpEvent<HttpResponse<{
    message: string, 
    currentProductsInCart: ILoginResponse["currentProductsInCart"], 
    currentTotalCartPrice: string
  }>> | HttpErrorResponse>{
    const result = await lastValueFrom(
      this.http.delete<any>(
        `${this.shoppingPathUrl}/delete_from_open_cart?currentProductLocationInTable=${currentProductLocationInTable}&cartId=${cartId}`
        )
      );
    return result;
  };

  async deleteAllItemsFromClientOpenCart (cartId: number): 
  Promise<HttpEvent<HttpResponse<{
    message: string, 
    currentProductsInCart: ILoginResponse["currentProductsInCart"], 
    currentTotalCartPrice: string
  }>> | HttpErrorResponse>{
    const result = await lastValueFrom(
      this.http.delete<any>(
        `${this.shoppingPathUrl}/delete_from_open_cart?cartId=${cartId}&emptyCart=true`
        )
      );
    return result;
  };

  async getOnlyGoodDates (): Promise<Array<string>>{
    const result: { message: string, finalGoodDatesArray: Array<string> } = await lastValueFrom(
      this.http.get<{ message: string, finalGoodDatesArray: Array<string> }>(
        `${this.shoppingPathUrl}/check_if_dates_ok_for_shipping`
        )
      );
    return result.finalGoodDatesArray as Array<string>;
  };
  
  async submitNewOrder (submitOrderObj: IsubmitOrderBody): Promise<HttpEvent<HttpResponse<any>> | HttpErrorResponse>{
    const options = { observe: 'response' as any }
    const result: { message: string, newRecentUploadedOrder: IOrderDB } | any = await lastValueFrom(
      this.http.post<any>(`${this.ordersPathUrl}/upload_new_order`, submitOrderObj, options)
      );
    return result;
  };


};
