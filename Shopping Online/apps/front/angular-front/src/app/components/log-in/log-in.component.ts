import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exeLoginSchema } from 'src/app/helpers/loginValidator';
import { AuthService } from 'src/app/services/auth.service';
import { ModalComponent } from '../app-components/modal/modal.component';

export interface ILoginResponse {
  userId: number;
  userName: string;
  userResidence: {
    city: string | null
    street: string | null
    house_number: number | null
  };
  message: string;
  isLoggedIn: boolean;
  token: string;
  role: string;
  isNewCustomer?: boolean;
  customerLastOrder?: {
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
  openCartNotExist?: boolean;
  cartCreatedAt?: object;
  currentTotalPrice?: string;
  currentProductsInCart?: Array<{
    id: number;
    name: string;
    category_id: number;
    price: string;
    image: string;
    quantity: number;
    total_price: string;
    cart_id: number;
    specific_row_location_in_cart_products_table: number;
  }>;
  openCartExist?: boolean;
  currentCartId?: number;
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
 public inputUsername: string;
 public inputPassword: string;
 public loginResponse: ILoginResponse;
 public staticImagePath: string;
 public imagePathes: Array<string>;
 public currentImage: string;
 public adminTitle: string = "admin";
  constructor(
    public authService: AuthService, 
    public modalComponent: ModalComponent, 
    private router: Router) { 
  this.inputUsername = ""
  this.inputPassword = ""
  this.loginResponse = {
    userId: 0,
    userName: "",
    userResidence: {
      city: "" ,
      street: "",
      house_number: 0
    },
    message: "",
    isLoggedIn: false,
    token: "",
    role: "",
    isNewCustomer: false,
    customerLastOrder: {
      id: 0,
      customer_id: 0,
      cart_id: 0,
      final_price: "",
      ship_city: "",
      ship_street: "",
      ship_house_number: 0,
      ship_date_time: {},
      order_submitted_at: {},
      last_4_digits_credit_card: 0
      },
    openCartNotExist: false,
    cartCreatedAt: {},
    currentTotalPrice: "",
    currentProductsInCart: [{
      id: 0,
      name: "",
      category_id: 0,
      price: "",
      image: "",
      quantity: 0,
      total_price: "",
      cart_id: 0,
      specific_row_location_in_cart_products_table: 0
    }],
    openCartExist: false,
    currentCartId: 0
  }
  this.staticImagePath = "url('/assets/upload/shppingBag.jpg')";
  this.imagePathes = ["url('/assets/upload/sale.jpg')", "url('/assets/upload/sale2.jpg')"];
  this.currentImage = "url('/assets/upload/sale2.jpg')";
  }
async ngOnInit() {

  try{
    let authToken: string | null = this.authService.getTokenLS();
    if(authToken === null || authToken === "") authToken = "demoStringToken";
    const result = await this.authService.veirfyLoginForLoggedInUsers(authToken);
    const resultSecond: ILoginResponse | HttpErrorResponse = await this.authService.login({ 
    userName: result.body.userName,
    verifiedToken: true 
  });
  
  function _isILoginResponse(obj: any): obj is ILoginResponse {
    return 'userName' in obj && 'userResidence' in obj && 'message' in obj && 'token' in obj && 'role' in obj;
  };
  
  if (_isILoginResponse(resultSecond)) { 
    if (resultSecond.role === this.adminTitle) this.router.navigate(['/administration']); 
    this.loginResponse = resultSecond; 
    this.authService.setTokenLS(resultSecond.token); 
    this.authService.tokenSaver(resultSecond.token);
    let index = 0;
    const _change = () => {
    this.currentImage = this.imagePathes[index];
    index > 0 ? index = 0 : index++;
  }
    setInterval(_change, 6000);
    return; 
  }
  } catch(ex: any){
    console.log(ex)
  }
  };
  

async onloginSubmit (): Promise<void> {
  try{
    await exeLoginSchema().validate({
      userName: this.inputUsername, 
      password: this.inputPassword
    })
  }
  catch(ex: any){
    console.log(ex);
    const errorText = ex.errors[0];
    let finalErrorText: string="";
    if (errorText.includes("userName")) { 
    finalErrorText = errorText.replace("userName", "Username"); 
    this.modalComponent.customErrorAlert(finalErrorText, 'warning'); return; }  
    if (errorText.includes("password")) { 
      finalErrorText = errorText.replace("password", "Password"); 
      this.modalComponent.customErrorAlert(finalErrorText, 'warning'); return; }  
      return;
  }

try{
 const result: ILoginResponse | HttpErrorResponse = await this.authService.login({ 
  userName: this.inputUsername, 
  password: this.inputPassword 
});

function _isILoginResponse(obj: any): obj is ILoginResponse {
  return 'userName' in obj && 'userResidence' in obj && 'message' in obj && 'token' in obj && 'role' in obj;
}

if (_isILoginResponse(result)) {
  if (result.role === this.adminTitle) this.router.navigate(['/administration']); 
  this.loginResponse = result; 
  this.authService.setTokenLS(result.token); 
  this.modalComponent.alertWithSuccess('Great !', 'You have logged in succesfully!', 'success');  
  this.authService.tokenSaver(result.token);
  let index = 0;
  const _change = () => {
  this.currentImage = this.imagePathes[index];
  index > 0 ? index = 0 : index++;
}
  setInterval(_change, 6000);
  return; 
}
} catch(ex: any){
  console.log(ex)
  if (ex.status === 404) {this.modalComponent.customErrorAlertWithBody(
    'We did not find you in our system',
    'You can close this window and try again',
     'error'
     ); return;
    }
    else if (ex.status === 401) {this.modalComponent.customErrorAlertWithBody(
      'Either your Username or Password are incorrect',
      'You can close this window and try again',
       'error'
       ); return;
      }  
      else if (ex.status === 403 || ex.status === 500) {
        this.modalComponent.errorAlert(); 
        return;
        }
       else this.modalComponent.errorAlert();
}
};

goToShoppingPage () {
  this.router.navigate(['/shop']);
};

};
