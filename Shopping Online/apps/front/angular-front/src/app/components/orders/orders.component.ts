import { HttpErrorResponse } from '@angular/common/http';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ModalComponent } from '../app-components/modal/modal.component';
import { ILoginResponse } from '../log-in/log-in.component';
import { IOrderDB, IsubmitOrderBody, ShoppingService } from 'src/app/services/shopping.service';
import { exeSubmitOrderSchema } from 'src/app/helpers/submitOrderValidation';


const cities = [
  "Haifa", 
  "Jerusalem", 
  "Tel Aviv", 
  "Rishon LeZion", 
  "Ashdod", 
  "Petah Tikva", 
  "Netanya", 
  "Beersheba", 
  "Holon", 
  "Bnei Brak"
];

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  public viewport!: CdkVirtualScrollViewport;
  public loginResponse: ILoginResponse | {};
  public customerId: undefined | ILoginResponse["userId"]
  public currentCartId: ILoginResponse["currentCartId"];
  public currentProductsInClientOpenCart: [] | ILoginResponse["currentProductsInCart"]
  public currentTotalCartPrice: string | number | undefined;
  public searchedProduct: undefined | string;
  public street: any;
  public streetDefualtPendingUserEvent: undefined | ILoginResponse["userResidence"]["street"];
  public houseNumber: any;
  public houseNumberDefualtPendingUserEvent: undefined | ILoginResponse["userResidence"]["house_number"];
  public cities: Array<string>;
  public city: any;
  public cityDefualtPendingUserEvent: undefined | ILoginResponse["userResidence"]["city"];
  public goodDatesArray: [] | Array<string>;
  public selectedDate: any;
  public hour: any;
  public creditCard: undefined | number | string;
  public orderDetails: undefined | IOrderDB;
  constructor(
    public ShoppingService: ShoppingService,
    public authService: AuthService,
    private router: Router, 
    public modalComponent: ModalComponent
    ) { 
      this.loginResponse = {};  
      this.currentProductsInClientOpenCart = [];
      this.street = "";
      this.cities = cities;
      this.city = "";
      this.goodDatesArray = [];
    }

async ngOnInit(): Promise<void> {
    try{
    let authToken: string | null = this.authService.getTokenLS();
    if(authToken === null || authToken === "") authToken = "dummyStringToken";
    const result = await this.authService.veirfyLoginForLoggedInUsers(authToken);
    const resultSecond: ILoginResponse | HttpErrorResponse = await this.authService.login({ 
    userName: result.body.userName,
    verifiedToken: true 
  });
    function _isILoginResponse(obj: any): obj is ILoginResponse {
    return 'userName' in obj && 'userResidence' in obj && 'message' in obj && 'token' in obj && 'role' in obj;
  };
    if (_isILoginResponse(resultSecond)) { 
    this.loginResponse = resultSecond;
    this.currentCartId =  resultSecond.currentCartId;
    this.customerId = resultSecond.userId;
    this.streetDefualtPendingUserEvent = resultSecond.userResidence.street;
    this.houseNumberDefualtPendingUserEvent = resultSecond.userResidence.house_number;
    this.cityDefualtPendingUserEvent = resultSecond.userResidence.city;
    this.authService.setTokenLS(resultSecond.token); 
    this.authService.tokenSaver(resultSecond.token);
  }
    }
    catch(ex: any){
      console.log(ex)
      if (ex.status === 401) {this.modalComponent.customErrorAlertWithBody(
        'Something Went Wrong',
        'You can close this window and try Re-Login',
         'error'
         ); 
        }
      this.router.navigate(['/']);
      return;
    }
    if (this.authService.openCartExist) {
      if ('currentProductsInCart' in this.authService.loginResponse) {
        const { currentProductsInCart, currentTotalPrice } = this.authService.loginResponse;
        this.currentProductsInClientOpenCart = currentProductsInCart;
        this.currentTotalCartPrice = currentTotalPrice;
      }
    };
    if(Array.isArray(this.currentProductsInClientOpenCart) 
    && !this.currentProductsInClientOpenCart.length
    || this.authService.isNewCustomer 
    || this.authService.openCartNotExist) {
      this.router.navigate(['/shop']);
    }
      try{
      const result = await this.ShoppingService.getOnlyGoodDates();
      if (Array.isArray(result)) this.goodDatesArray = result;
      }
      catch(ex){
        console.log(ex)
        this.modalComponent.errorAlert();
      }
  };

  searchedProducts(): void{
    console.log("active")
    if (!this.searchedProduct) {
    const searchedProductsArr = this.currentProductsInClientOpenCart?.map((productObj) => ({...productObj, dummyProperty: false}))
    if (Array.isArray(this.currentProductsInClientOpenCart)) this.currentProductsInClientOpenCart = searchedProductsArr;
        return;
    }
    const searchedProductsArr = this.currentProductsInClientOpenCart?.map((productObj) => (
      productObj.name.toLowerCase().includes(this.searchedProduct as string) ? 
      {...productObj, dummyProperty: true} : {...productObj, dummyProperty: false})) 
    if (Array.isArray(this.currentProductsInClientOpenCart)) this.currentProductsInClientOpenCart = searchedProductsArr;
  };
 
  onBackToShopSubmit (): void{
    this.router.navigate(['/shop']);
  };

  onDblClickEventInputs (): void{
    this.street = this.streetDefualtPendingUserEvent;
    this.houseNumber = this.houseNumberDefualtPendingUserEvent;
    this.city = this.cityDefualtPendingUserEvent;
  };
  
  getFirstDayOfNextMonth (): Date {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  };
  
  
  myDatesFilter = (d: Date | null): any => {
    if (!d) return;
    if ((d as Date).getMonth() === new Date().getMonth() && this.goodDatesArray){
    const goodDatesArray: Array<string> = this.goodDatesArray;
    const goodDatesArrayDatesObjs: Array<any> = goodDatesArray.map((dateString: string) => new Date(dateString).toString().slice(0,15));
    const fullDate: Date = d as Date;
    const fullDateSliced: string = fullDate.toString().slice(0,15);
    return goodDatesArrayDatesObjs.find(dateObj => dateObj === fullDateSliced);
    }
    else if ( (d as any).getMonth() as number > new Date().getMonth() && this.goodDatesArray){
    return true;
    }
  };
  
  async onSubmitOrder(): Promise<void>{
    try {
      await exeSubmitOrderSchema().validate({
      city: this.city,
      street: this.street,
      houseNumber: this.houseNumber,
      date: this.selectedDate,
      hour: this.hour,
      creditCard: this.creditCard?.toString()
      })
    }
    catch(ex: any){
      let errorText = ex.errors[0];
      if(errorText.includes("city")) errorText = "You need to choose a City from the list"
      if(errorText.includes("street")) errorText = errorText.replace("street", "Street");  
      if(errorText.includes("houseNumber")) errorText = errorText.replace("houseNumber", "House Number"); 
      if(errorText.includes("date")) errorText = errorText.replace("date", "Date");  
      if(errorText.includes("hour")) errorText = errorText.replace("hour", "Hour");  
      this.modalComponent.customErrorAlert(errorText, 'warning'); 
      return;
    }
    const slicedDate: string = new Date(this.selectedDate).toISOString().slice(0, 10).replace('T', ' ');
    const dateTimeMySqlFormat: string = `${slicedDate} ${this.hour}:00`;
    const stringCC: any = this.creditCard?.toString();
    const slicedStringCC: string = stringCC?.slice(12);
    const finalNumberCCLast4digits = Number(slicedStringCC);
    try {
    const recentlyUploadedOrder: any = 
    await this.ShoppingService.submitNewOrder({
      customerId: this.customerId,
      cartId: this.currentCartId,
      finalPrice: this.currentTotalCartPrice,
      city: this.city,
      street: this.street,
      houseNumber: this.houseNumber,
      dateTime: dateTimeMySqlFormat,
      last4DigitsCc: finalNumberCCLast4digits
    } as IsubmitOrderBody)
    const newRecentUploadedOrderBody: { message: string, newRecentUploadedOrder: IOrderDB } = recentlyUploadedOrder.body;
    const newRecentUploadedOrder: IOrderDB = newRecentUploadedOrderBody.newRecentUploadedOrder;
    this.orderDetails = newRecentUploadedOrder;
    }
    catch(ex){
    this.modalComponent.errorAlert();
    }
    const value: boolean = await this.modalComponent.onSuccessSubmitOrderModal();
    if (value) this.onSubmitForReceipt();
    this.router.navigate(['/']);
    return;
  };

onSubmitForReceipt(): void{
  const arrForReciept: Array<string> | undefined = this.currentProductsInClientOpenCart?.map(({
    id, category_id, image, cart_id, specific_row_location_in_cart_products_table, ...rest})=> JSON.stringify(rest)); 
  const totalPriceObj: { TotalPrice: string } = { TotalPrice: `${this.orderDetails?.final_price}$` }
  arrForReciept?.push(JSON.stringify(totalPriceObj));
  const fileName: string = `receipt_order_no_${this.orderDetails?.id}.txt`;
  const myFile: Blob = new Blob([(arrForReciept as Array<string>).join(',\n')], {type: "text/plain", endings: 'native'});
  window.URL = window.URL || window.webkitURL;
  const downloadBtn: HTMLAnchorElement = document.createElement("a");
  downloadBtn.id = "download";
  downloadBtn.setAttribute("href", window.URL.createObjectURL(myFile));
  downloadBtn.setAttribute("download", fileName);
  downloadBtn.click();
  };

};
