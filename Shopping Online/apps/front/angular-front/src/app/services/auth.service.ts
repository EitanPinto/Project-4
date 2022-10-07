import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ILoginResponse } from '../components/log-in/log-in.component';



export const selectedPort: number = 3500

export interface Iuser {
  userName: string;
  password?: string; 
  verifiedToken?: boolean;
}; 

export interface IregisterLevelOneResponse {
  message: string;
  status?: number;
};

export interface IregisterLevelTwoBody {
  id: number;
  userName: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  firstName: string;
  lastName: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = `http://localhost:${selectedPort}/auth`
  public token: string;
  public userName: ILoginResponse["userName"];
  public userId: ILoginResponse["userId"] | undefined;
  public isNewCustomer: ILoginResponse["isNewCustomer"] | undefined;
  public openCartNotExist: ILoginResponse["openCartNotExist"] | undefined;
  public openCartExist: ILoginResponse["openCartExist"] | undefined;
  public isLoggedIn: ILoginResponse["isLoggedIn"] | undefined;
  public cartCreatedAt: ILoginResponse["cartCreatedAt"] | string | undefined;
  public currentTotalPrice: ILoginResponse["currentTotalPrice"] | undefined;
  public order_submitted_at: string | object | undefined;
  public final_price: string | undefined;
  public goToShoppingPageButtonText: string = "Start Shopping"
  public loginResponse: ILoginResponse | {};
  public isSignOutButtonPresented: boolean = false;
  constructor(private http: HttpClient) {
  this.token = "";
  this.userName = 'Guest';
  this.loginResponse = {};
  }
  async login (userObj: Iuser): Promise<ILoginResponse | HttpErrorResponse>{
    const result: ILoginResponse | HttpErrorResponse = await lastValueFrom(this.http.post<any>(`${this.url}/login`, userObj));
    if ('userId' in result) this.userId = result.userId;
    if ('userName' in result) this.userName = result.userName;
    if ('isLoggedIn' in result) this.isLoggedIn = result.isLoggedIn;
    if ('isNewCustomer' in result) {
      this.isNewCustomer = result.isNewCustomer;
      this.openCartExist = undefined;
      this.openCartNotExist = undefined;
      this.goToShoppingPageButtonText = "Start Shopping";
    }
    if ('openCartNotExist' in result) {
      this.openCartNotExist = result.openCartNotExist;
      this.order_submitted_at = JSON.stringify(result.customerLastOrder?.order_submitted_at).slice(1, 11).replace('T', ' ');
      this.final_price = result.customerLastOrder?.final_price;
      this.openCartExist = undefined;
      this.isNewCustomer = undefined;
      this.goToShoppingPageButtonText = "Start Shopping";
    }
    if ('openCartExist' in result){ 
      this.goToShoppingPageButtonText = "Resume Shopping"
      this.openCartExist = result.openCartExist;
      this.cartCreatedAt = JSON.stringify(result.cartCreatedAt).slice(1, 11).replace('T', ' ');
      this.currentTotalPrice = result.currentTotalPrice;
      this.openCartNotExist = undefined;
      this.isNewCustomer = undefined;
    }
    this.loginResponse = result;
    this.isSignOutButtonPresented = true;
    return result;
  };

  tokenSaver (token: string){
    this.token = token;
  };

  setTokenLS = (token: string): void => {
    if (!token) return;
    localStorage.setItem("authorization", token);
    return;
};

async registerLevelOne (id: {id: number}): Promise<HttpEvent<HttpResponse<IregisterLevelOneResponse>> | HttpErrorResponse>{
  const options = { observe: 'response' as any }
  const result = await lastValueFrom(
    this.http.post<any>(`${this.url}/registerLevelOne`, id, options)
    );
  return result;
};

async registerLevelTwo (newUserObjLevelTwo: IregisterLevelTwoBody): Promise<HttpEvent<HttpResponse<any>> | HttpErrorResponse>{
  const options = { observe: 'response' as any }
  const result = await lastValueFrom(
    this.http.post<any>(`${this.url}/registerLevelTwo`, newUserObjLevelTwo, options)
    );
  return result;
};

async veirfyLoginForLoggedInUsers (token: string | null): Promise<any>{
  const options = { observe: 'response' as any }
  const result = await lastValueFrom(
    this.http.get<any>(`http://localhost:${selectedPort}/validate_front_token?frontToken=${token}`,  options)
    );
  if("body" in result) this.userName = result.body.userName;
  return result;
};

getTokenLS = (): string | null => {
  const tokenLs = localStorage.getItem("authorization");
  return tokenLs;
};

clearToken = (): void => {
  localStorage.removeItem("authorization");
  return;
};

};
